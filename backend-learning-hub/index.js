require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { GoogleGenAI } = require("@google/genai");

// Centralized database configuration instance
const sequelize = require("./database");

// Database Models
const User = require("./models/User");
const Course = require("./models/Course");
const Lesson = require("./models/Lesson");
const Enrollment = require("./models/Enrollment");

// Security Middleware Components
const {
  authenticateJWT,
  authorizeRoles,
} = require("./middleware/authMiddleware");

// Structural Relationships Configurations
User.hasMany(Course, { foreignKey: "instructorId", onDelete: "CASCADE" });
Course.belongsTo(User, { foreignKey: "instructorId", as: "instructor" });
Course.hasMany(Lesson, {
  foreignKey: "courseId",
  as: "lessons",
  onDelete: "CASCADE",
});
Lesson.belongsTo(Course, { foreignKey: "courseId" });
User.belongsToMany(Course, { through: Enrollment, foreignKey: "userId" });
Course.belongsToMany(User, { through: Enrollment, foreignKey: "courseId" });

const app = express();

// Allowed Origins List for local and production deployments
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://192.168.137.1:5173",
  "https://ye-tizita.vercel.app", // CORS PRODUCTION FIX: Authorized production client domain
  process.env.FRONTEND_PRODUCTION_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        allowedOrigins.some((o) => origin.startsWith(o))
      ) {
        return cb(null, true);
      }
      return cb(
        new Error(
          `CORS policy rejection: Origin ${origin} not explicitly authorized.`,
        ),
      );
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// AI Client Instantiation
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Local File Upload Storage Setup
const uploadDirectory = path.join(__dirname, "uploads", "courses");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const uploadHandler = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDirectory),
    filename: (req, file, cb) =>
      cb(null, `course-${Date.now()}${path.extname(file.originalname)}`),
  }),
  fileFilter: (req, file, cb) =>
    [".pdf", ".zip", ".rar"].includes(
      path.extname(file.originalname).toLowerCase(),
    )
      ? cb(null, true)
      : cb(new Error("Invalid file type.")),
  limits: { fileSize: 25 * 1024 * 1024 },
});
// --- MOUNT MODULAR API ROUTERS ---
const authRouter = require("./routes/authRoutes");
const enrollmentRouter = require("./routes/enrollmentRoutes");

app.use("/api", authRouter);
app.use("/api", enrollmentRouter);

// --- CORE SYSTEM ROUTES ---
app.get("/api/health", (req, res) =>
  res.json({ success: true, status: "healthy" }),
);

// GET: Fetch Public Course Catalog Directory
app.get("/api/courses", async (req, res) => {
  try {
    const data = await Course.findAll({
      include: [
        { model: User, as: "instructor", attributes: ["username"] },
        { model: Lesson, as: "lessons", attributes: ["id", "title", "order"] },
      ],
      order: [
        ["id", "ASC"],
        [{ model: Lesson, as: "lessons" }, "order", "ASC"],
      ],
    });
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET: Fetch single course workspace including all lessons
app.get("/api/courses/:id", async (req, res) => {
  try {
    const courseData = await Course.findByPk(req.params.id, {
      include: [
        { model: User, as: "instructor", attributes: ["username"] },
        {
          model: Lesson,
          as: "lessons",
          attributes: ["id", "title", "content", "videoUrl", "order"],
        },
      ],
      order: [[{ model: Lesson, as: "lessons" }, "order", "ASC"]],
    });
    if (!courseData)
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    res.status(200).json({ success: true, data: courseData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST: Course Deployment Endpoint (Instructors only)
app.post(
  "/api/courses",
  authenticateJWT,
  authorizeRoles("instructor"),
  uploadHandler.single("courseFile"),
  async (req, res) => {
    try {
      const filePath = req.file
        ? `/uploads/courses/${req.file.filename}`
        : null;
      const course = await Course.create({
        ...req.body,
        instructorId: req.user.id,
        price: req.body.price || 0.0,
        fileUrl: filePath,
      });
      res.status(201).json({ success: true, data: course });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
);

// POST: Add Lesson to a Course Syllabus (Instructors only)
app.post(
  "/api/courses/:id/lessons",
  authenticateJWT,
  authorizeRoles("instructor"),
  async (req, res) => {
    try {
      const courseId = req.params.id;
      const course = await Course.findOne({
        where: { id: courseId, instructorId: req.user.id },
      });
      if (!course) {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized course constraint." });
      }

      const lesson = await Lesson.create({ ...req.body, courseId });
      res.status(201).json({ success: true, data: lesson });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
);

// POST: AI Copilot with Live Lesson Context
app.post("/api/copilot", async (req, res) => {
  try {
    const { prompt, chatHistory, courseContext, currentActiveLesson } =
      req.body;
    if (!prompt)
      return res
        .status(400)
        .json({ success: false, message: "Prompt missing" });

    const contents = [];
    if (chatHistory?.length > 0) {
      chatHistory.forEach((m) => {
        if (m.sender === "user" || m.sender === "gemini") {
          contents.push({
            role: m.sender === "user" ? "user" : "model",
            parts: [{ text: m.text }],
          });
        }
      });
    }
    contents.push({ role: "user", parts: [{ text: prompt }] });

    const lessonTitle = currentActiveLesson?.title || "General Topic";
    const lessonBody =
      currentActiveLesson?.content || "No lesson context provided.";
    const courseTitle = courseContext?.title || "General Subject";

    const systemPromptInstruction =
      `You are an elite AI Teacher and Copilot guiding a student on the Ethiopian Learning Hub portal.\n` +
      `Your current environment context is:\n` +
      `- Course Title: ${courseTitle}\n` +
      `- Active Chapter/Lesson: ${lessonTitle}\n` +
      `-------------------------------------------\n` +
      `CRITICAL INSTRUCTIONAL CONTEXT TEXT:\n` +
      `${lessonBody}\n` +
      `-------------------------------------------\n` +
      `Operational Rules:\n` +
      `1. Ground your technical explanation strictly within the provided lesson text boundaries above.\n` +
      `2. Keep explanations conversational, brief, structured, and highly accessible to non-native English speakers.\n` +
      `3. If the student asks about something outside this lesson domain context, gently pivot them back to finishing the active chapter.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: { systemInstruction: systemPromptInstruction, temperature: 0.3 },
    });

    res.status(200).json({ success: true, text: response.text });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "AI error: " + err.message });
  }
});

// --- OPTIMIZED SERVER INITIALIZATION PIPELINE ---
const startServer = async () => {
  const PORT = process.env.PORT || 10000; // Instantly defaults cleanly to Render container environment demands

  // 1. Start listening on the port IMMEDIATELY to prevent port-binding timing errors
  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `🚀 Express server successfully bound and listening on port ${PORT}`,
    );

    // Auto-pinging tool to protect free instances from sleeping cold-starts
    const selfEndpoint = process.env.BACKEND_PRODUCTION_URL;
    if (selfEndpoint) {
      setInterval(() => {
        fetch(`${selfEndpoint}/api/health`).catch(() => {});
      }, 840000); // Trigger every 14 minutes
    }
  });

  // 2. Connect and synchronize schema streams with Neon in the background asynchronously
  try {
    await sequelize.authenticate();
    console.log(
      "🚀 Connected to the Neon PostgreSQL database cluster securely.",
    );

    const isProduction =
      process.env.NODE_ENV === "production" || process.env.RENDER === "true";
    const shouldAlter = !isProduction;

    await sequelize.sync({ alter: shouldAlter });
    console.log(`📊 Schema tables synchronized! Alter status: ${shouldAlter}`);
  } catch (err) {
    console.error("❌ Database initialization failed post-boot sequence:", err);
  }
};

startServer();
