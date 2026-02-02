const express = require("express");
const { getUsers } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

// GET /api/users - admin only
router.get("/", protect, adminOnly, getUsers);

module.exports = router;
