const Material = require("../models/Material");

/**
 * GET /api/materials - List all materials (public)
 */
const getMaterials = async (req, res, next) => {
  try {
    const materials = await Material.find().lean();
    res.status(200).json({ success: true, data: materials });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/materials - Create material (admin only)
 */
const createMaterial = async (req, res, next) => {
  try {
    const material = await Material.create(req.body);
    res.status(201).json({ success: true, data: material });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMaterials, createMaterial };
