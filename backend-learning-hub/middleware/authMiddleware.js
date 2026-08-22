const jwt = require("jsonwebtoken");
const JWT_SECRET =
  process.env.JWT_SECRET || "ethiopian_learning_hub_secret_key_123!";

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access Denied: Missing or malformed token header",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Sets token user context data to req.user { id, role }
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired session token" });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Your profile role (${req.user?.role || "Guest"}) does not have permission.`,
      });
    }
    next();
  };
};

module.exports = { authenticateJWT, authorizeRoles };
