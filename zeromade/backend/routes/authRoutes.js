const express = require("express");
const { body, validationResult } = require("express-validator");
const { register, login, logout, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
  }
  next();
};

// Validation rules
const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email").trim().isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  body("role").isIn(["user", "admin"]).withMessage("Select login as User or Admin"),
];

// POST /api/auth/register
router.post("/register", authLimiter, registerValidation, handleValidation, register);

// POST /api/auth/login
router.post("/login", authLimiter, loginValidation, handleValidation, login);

// POST /api/auth/logout
router.post("/logout", logout);

// GET /api/auth/me - current user (JWT required; used by frontend to verify role before admin access)
router.get("/me", protect, getMe);

module.exports = router;
