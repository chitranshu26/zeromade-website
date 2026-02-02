const express = require("express");
const { body, validationResult } = require("express-validator");
const { getMaterials, createMaterial } = require("../controllers/materialController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
  }
  next();
};

// Public
router.get("/", getMaterials);

// Admin only
const materialValidation = [
  body("name").trim().notEmpty().withMessage("Material name is required"),
  body("description").optional().trim(),
];

router.post("/", protect, adminOnly, materialValidation, handleValidation, createMaterial);

module.exports = router;
