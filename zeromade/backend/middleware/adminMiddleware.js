/**
 * Restrict access to admin only. Must be used after authMiddleware (protect).
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ success: false, message: "Admin access only" });
};

module.exports = { adminOnly };
