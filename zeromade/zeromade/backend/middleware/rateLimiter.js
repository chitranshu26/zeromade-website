const rateLimit = require("express-rate-limit");

// Stricter limit for auth routes (login/register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: "Too many attempts. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: "Too many requests." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, apiLimiter };
