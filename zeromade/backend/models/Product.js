const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: "clothing",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    size: {
      type: [String],
      default: ["S", "M", "L", "XL"],
    },
    color: {
      type: [String],
      default: [],
    },
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

// Generate slug from name before save
productSchema.pre("save", function (next) {
  if (this.isModified("name") && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
