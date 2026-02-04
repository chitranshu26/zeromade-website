const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protect routes - verify JWT (from cookie or Authorization header)
 */
const protect = async (req, res, next) => {
  let token =
    req.cookies?.token ||
    (req.headers.authorization && req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = { protect };
