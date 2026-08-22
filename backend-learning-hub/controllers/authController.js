const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET =
  process.env.JWT_SECRET || "ethiopian_learning_hub_secret_key_123!";

const register = async (req, res) => {
  try {
    const { username, email, password, role, instructorCode } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already registered" });
    }

    let finalRole = "student"; // Default role assignments shield

    // Verification check for instructor accounts
    if (role === "instructor") {
      const serverTeacherCode =
        process.env.TEACHER_SECRET_PASSCODE || "Ethiopia2026";

      if (instructorCode === serverTeacherCode) {
        finalRole = "instructor";
      } else {
        return res.status(400).json({
          success: false,
          message:
            "Access Denied: The instructor verification passcode you entered is invalid.",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: finalRole,
    });

    const responsePayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    res.status(201).json({
      success: true,
      message: "User account created cleanly!",
      user: responsePayload,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { register, login };
