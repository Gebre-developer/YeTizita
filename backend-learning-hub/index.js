const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { DataTypes } = require("sequelize");
const { GoogleGenAI } = require("@google/genai");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
require("dotenv").config();

// Imports the centralized cloud-configured instance directly
const sequelize = require("./database");

// Load raw baseline models (Now safely fetching the active cloud context)
const User = require("./models/User");
const Course = require("./models/Course");
const Enrollment = require("./models/Enrollment");

// Map structural relationships cleanly and synchronously
User.hasMany(Course, { foreignKey: "instructorId", onDelete: "CASCADE" });
Course.belongsTo(User, { foreignKey: "instructorId", as: "instructor" });
User.belongsToMany(Course, { through: Enrollment, foreignKey: "userId" });
Course.belongsToMany(User, { through: Enrollment, foreignKey: "courseId" });

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.137.1:5173",
  process.env.FRONTEND_PRODUCTION_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) =>
      cb(
        null,
        !origin ||
          allowedOrigins.includes(origin) ||
          allowedOrigins.some((o) => origin.startsWith(o)),
      ),
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const uploadDirectory = path.join(__dirname, "uploads", "courses");
if (!fs.existsSync(uploadDirectory))
  fs.mkdirSync(uploadDirectory, { recursive: true });

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

const authenticateJWT = (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(401).json({ success: false, message: "Missing token" });
  req.user = { id: 1, role: "student" };
  next();
};

// --- CORE ROUTES ---
app.get("/api/health", (req, res) =>
  res.json({ success: true, status: "healthy" }),
);

app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hash,
      role: role || "student",
    });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user || !(await bcrypt.compare(req.body.password, user.password)))
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post(
  "/api/courses",
  uploadHandler.single("courseFile"),
  async (req, res) => {
    try {
      const path = req.file ? `/uploads/courses/${req.file.filename}` : null;
      const course = await Course.create({
        ...req.body,
        price: req.body.price || 0.0,
        fileUrl: path,
      });
      res.status(201).json({ success: true, data: course });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
);

app.get("/api/courses", async (req, res) => {
  try {
    const data = await Course.findAll({
      include: [{ model: User, as: "instructor", attributes: ["username"] }],
    });
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/student/my-courses", authenticateJWT, async (req, res) => {
  try {
    const data = await User.findByPk(req.user.id, {
      include: [
        { model: Course, include: [{ model: User, as: "instructor" }] },
      ],
    });
    res.status(200).json({ success: true, data: data?.Courses || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/enroll", async (req, res) => {
  try {
    const existing = await Enrollment.findOne({
      where: { userId: req.body.userId, courseId: req.body.courseId },
    });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Already enrolled" });
    await Enrollment.create(req.body);
    res.status(201).json({ success: true, message: "Enrolled successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/copilot", async (req, res) => {
  try {
    const { prompt, chatHistory, courseContext } = req.body;
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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: `You are an elite Google Gemini Assistant on the Ethiopian Learning Hub. Keep explanations brief. Context: ${JSON.stringify(courseContext || {})}`,
        temperature: 0.3,
      },
    });

    res.status(200).json({ success: true, text: response.text });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "AI error: " + err.message });
  }
});

// --- SERVER INITIALIZATION TIMELINE ---
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "🚀 Connected to the Neon PostgreSQL database cluster securely.",
    );
    await sequelize.sync({ alter: true });
    console.log("📊 All relational schema tables synchronized sequentially!");

    app.listen(process.env.PORT || 5000, "0.0.0.0", () =>
      console.log(
        `Server executing cleanly on port ${process.env.PORT || 5000}`,
      ),
    );
  } catch (err) {
    console.error("❌ Critical server boot strap pipeline crash:", err);
    process.exit(1);
  }
};

startServer();
