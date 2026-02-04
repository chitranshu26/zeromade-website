const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
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
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin only
const productValidation = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
];

router.post("/", protect, adminOnly, productValidation, handleValidation, createProduct);
router.put("/:id", protect, adminOnly, handleValidation, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
