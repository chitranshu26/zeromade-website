const Product = require("../models/Product");

/**
 * GET /api/products - List all products (public)
 */
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate("material", "name description").lean();
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/products/:id - Get single product by id or slug (public)
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isMongoId = /^[a-fA-F0-9]{24}$/.test(id);
    const query = isMongoId ? { _id: id } : { slug: id };
    const product = await Product.findOne(query).populate("material", "name description").lean();
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/products - Create product (admin only)
 */
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/products/:id - Update product (admin only)
 */
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/products/:id - Delete product (admin only)
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
