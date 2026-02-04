const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!uri) {
      console.error("❌ MongoDB URI missing in environment variables");
      process.exit(1);
    }

    // Prevent multiple connections
    if (mongoose.connection.readyState === 1) {
      console.log("⚡ MongoDB already connected");
      return;
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);

    // Retry connection after 5 sec (important for Render cold starts)
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
