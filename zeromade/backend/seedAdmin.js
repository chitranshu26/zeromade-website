/**
 * Admin seeding script — run manually, one time only.
 * Usage: node backend/seedAdmin.js (from project root) or node seedAdmin.js (from backend/)
 *
 * Creates exactly ONE admin if none exists. Safe to run multiple times.
 * ⚠️ CHANGE THE ADMIN PASSWORD after first login (e.g. via MongoDB or a dedicated change-password flow).
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

// Temporary placeholder credentials — developer MUST change password after first use.
const ADMIN_EMAIL = "admin@zeromade.com";
const ADMIN_PASSWORD = "Admin@123";
const ADMIN_NAME = "Zeromade Admin";

async function seedAdmin() {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      console.error("Missing MongoDB URI. Set MONGODB_URI or MONGO_URI in .env");
      process.exit(1);
    }

    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected.");

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin already exists. Exiting safely.");
      await mongoose.disconnect();
      process.exit(0);
      return;
    }

    // User model pre-save hook hashes password with bcrypt
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    });

    console.log("Admin created successfully.");
    console.log("Email:", ADMIN_EMAIL);
    console.log("⚠️  Change this password after first login.");
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedAdmin();
