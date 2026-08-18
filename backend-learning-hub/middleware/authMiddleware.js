const jwt = require("jsonwebtoken");

// Verify if user is logged in
exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  // Splits "Bearer <token>" string cleanly into an array schema configuration setup
  const tokenParts = authHeader.split(" ");
  const actualToken = tokenParts[1]; // Extract the token string safely at index position 1

  if (!actualToken)
    return res.status(401).json({ message: "Malformed authorization token" });

  jwt.verify(actualToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded; // Contains id and role parameters safely passed into downstream queries
    next();
  });
};
// Verify if user has the correct role
exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not have permission" });
    }
    next();
  };
};
