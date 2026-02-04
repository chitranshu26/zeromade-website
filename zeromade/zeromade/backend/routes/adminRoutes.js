/**
 * Admin routes - all admin-only endpoints are under their resource routes:
 * - POST/PUT/DELETE /api/products -> productRoutes
 * - POST /api/materials -> materialRoutes
 * - GET /api/users -> userRoutes
 * This file can mount additional admin-only routes if needed.
 */
const express = require("express");
const router = express.Router();

// Placeholder - admin logic is in product/material/user routes with adminMiddleware
router.get("/", (req, res) => {
  res.json({ success: true, message: "Admin API - use /api/products, /api/materials, /api/users with admin auth" });
});

module.exports = router;
