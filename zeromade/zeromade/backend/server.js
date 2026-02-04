require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");
const { authLimiter, apiLimiter } = require("./middleware/rateLimiter");

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const materialRoutes = require("./routes/materialRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// CORS — allow frontend origin and credentials (fixes "Failed to fetch")
// In development, allow common localhost ports so CLIENT_URL need not match exact frontend port
const allowedOrigins = [CLIENT_URL, "http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"];
const corsOrigin = process.env.NODE_ENV === "production"
  ? CLIENT_URL
  : (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, origin || CLIENT_URL);
    else cb(null, false);
  };
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body & cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
app.use("/api/", apiLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ success: true, message: "API running" }));

// 404
app.use("/api/*", (req, res) => res.status(404).json({ success: false, message: "Not found" }));

// Centralized error handler (must be last)
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
