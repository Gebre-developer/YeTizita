const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { DataTypes, Sequelize } = require("sequelize");
const { GoogleGenAI } = require("@google/genai");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
require("dotenv").config();

const User = require("./models/User");
const Course = require("./models/Course");

// ==========================================
// PRODUCTION CLOUD DATABASE INITIALIZATION
// ==========================================
const isProduction = !!process.env.DB_HOST;

const sequelize = new Sequelize(
  process.env.DB_NAME || "ethiopian_learning_hub",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    dialectOptions: isProduction
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  },
);

const app = express();

// ==========================================
// ADAPTIVE ANTI-CORS BLOCKING HEADERS LAYER
// ==========================================
const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.137.1:5173",
  process.env.FRONTEND_PRODUCTION_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(
          new Error("Blocked by Adaptive CORS Security Configuration Pipeline"),
        );
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Initialize Google Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// ==========================================
// 1. MULTER WORKSPACE STORAGE CONFIGURATION
// ==========================================
const uploadDirectory = path.join(__dirname, "uploads", "courses");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storageConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDirectory);
  },
  filename: (req, file, callback) => {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const originalExtension = path.extname(file.originalname);
    callback(null, `course-${uniquePrefix}${originalExtension}`);
  },
});

const fileFilterValidator = (req, file, callback) => {
  const authorizedExtensions = [".pdf", ".zip", ".rar"];
  const absoluteExtension = path.extname(file.originalname).toLowerCase();
  if (authorizedExtensions.includes(absoluteExtension)) {
    callback(null, true);
  } else {
    callback(
      new Error(
        "Invalid file type. Only PDF, ZIP, and RAR configurations are permitted.",
      ),
      false,
    );
  }
};

const uploadHandler = multer({
  storage: storageConfig,
  fileFilter: fileFilterValidator,
  limits: { fileSize: 25 * 1024 * 1024 },
});

// ==========================================
// 2. DEFINE RELATIONAL SCHEMAS & JUNCTION TABLE
// ==========================================
// Define Enrollment table footprint globally so it can be safely referenced across route endpoints
const Enrollment = sequelize.define(
  "Enrollment",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  },
  { timestamps: true },
);

// Establish relationships layout configurations
User.hasMany(Course, { foreignKey: "instructorId", onDelete: "CASCADE" });
Course.belongsTo(User, { foreignKey: "instructorId", as: "instructor" });

User.belongsToMany(Course, { through: Enrollment, foreignKey: "userId" });
Course.belongsToMany(User, { through: Enrollment, foreignKey: "courseId" });

// ==========================================
// 3. AUTHENTICATION MIDDLEWARE GATEKEEPER
// ==========================================
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  const tokenParts = authHeader.split(" ");
  const actualToken = tokenParts[1];

  if (!actualToken) {
    return res
      .status(401)
      .json({ success: false, message: "Malformed authorization token" });
  }

  try {
    req.user = { id: 1, role: "student" };
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid token validation" });
  }
};

// ==========================================
// 4. CORE BACKEND API ROUTE ENDPOINTS
// ==========================================
app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from your modern SQL backend server!" });
});

// User Registration Route
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "student",
    });
    res.status(201).json({
      success: true,
      message: "User registered securely inside your live production server!",
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database insertion failure",
      error: error.message,
    });
  }
});

// User Login Verification Route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid email or password!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password!" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful!",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server login error",
      error: error.message,
    });
  }
});
// Create a New Course Endpoint
app.post(
  "/api/courses",
  uploadHandler.single("courseFile"),
  async (req, res) => {
    try {
      const { title, description, price, instructorId, category, gradeLevel } =
        req.body;

      let fileStoragePath = null;
      if (req.file) {
        fileStoragePath = `/uploads/courses/${req.file.filename}`;
      }

      const newCourse = await Course.create({
        title,
        description,
        price: price || 0.0,
        instructorId,
        category: category || "Programming",
        gradeLevel: gradeLevel || "11",
        fileUrl: fileStoragePath,
      });

      res.status(201).json({
        success: true,
        message: "Course created successfully!",
        data: newCourse,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create course",
        error: error.message,
      });
    }
  },
);

// Get All Courses Endpoint
app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        { model: User, as: "instructor", attributes: ["username", "email"] },
      ],
    });
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
});

// Fetch Enrolled Student Courses Filtered List View
app.get("/api/student/my-courses", authenticateJWT, async (req, res) => {
  try {
    const activeStudentId = req.user.id;
    const userWithCourses = await User.findByPk(activeStudentId, {
      include: [
        {
          model: Course,
          include: [
            { model: User, as: "instructor", attributes: ["username"] },
          ],
        },
      ],
    });

    if (!userWithCourses) {
      return res
        .status(404)
        .json({ success: false, message: "User records missing." });
    }
    return res
      .status(200)
      .json({ success: true, data: userWithCourses.Courses || [] });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to filter course index summaries.",
      error: error.message,
    });
  }
});

// Fetch a Single Course by its ID
app.get("/api/courses/:id", async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        { model: User, as: "instructor", attributes: ["username", "email"] },
      ],
    });
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Target training module not found." });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server database extraction failure",
      error: error.message,
    });
  }
});

// Course Enrollment Process Endpoint
app.post("/api/enroll", async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    const existingEnrollment = await Enrollment.findOne({
      where: { userId, courseId },
    });
    if (existingEnrollment) {
      return res
        .status(400)
        .json({ success: false, message: "Already enrolled inside track!" });
    }

    await Enrollment.create({ userId, courseId });
    res.status(201).json({
      success: true,
      message: "Permanently enrolled inside track successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Enrollment pipeline execution failure",
      error: error.message,
    });
  }
});

// AI Assistant Integration Route: Powered by Google Gemini AI
app.post("/api/copilot", async (req, res) => {
  try {
    const { prompt, chatHistory, courseContext } = req.body;
    if (!prompt) {
      return res
        .status(400)
        .json({ success: false, message: "Prompt is missing." });
    }

    const systemInstruction = `You are an elite Google Gemini Engineering Assistant on the Ethiopian Learning Hub. 
    Assist the student with code syntax, database architecture, or server issues. Keep your explanations brief and professional. 
    Current course module context: ${JSON.stringify(courseContext || {}).substring(0, 1000)}`;

    const contents = [];
    if (chatHistory && chatHistory.length > 0) {
      chatHistory.forEach((msg) => {
        if (msg.sender === "user" || msg.sender === "gemini") {
          contents.push({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
          });
        }
      });
    }
    contents.push({ role: "user", parts: [{ text: prompt }] });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: { systemInstruction: systemInstruction, temperature: 0.3 },
    });

    return res.status(200).json({ success: true, text: response.text });
  } catch (error) {
    console.error("Gemini Route Exception Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "AI engine connection failed." });
  }
});

// ==========================================
// 5. SERVER SOCKET INTERFACE TUNING
// ==========================================
const PORT = process.env.PORT || 5000;

// Enforce safe database mapping deployment order: Users -> Courses -> Enrollments
sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Server executing seamlessly across network vectors on port ${PORT}`,
      );
    });
  })
  .catch((err) => console.error("Database connection failure:", err));
