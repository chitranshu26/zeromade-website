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

const app = express();

/* ENV */
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL;

/* DB */
connectDB();

/* SECURITY */
app.use(helmet());

/* CORS */
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

/* BODY */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* RATE LIMIT */
app.use("/api/", apiLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

/* HEALTH ROUTE (IMPORTANT) */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API running",
  });
});

/* ROOT ROUTE */
app.get("/", (req, res) => {
  res.send("Zeromade Backend Running 🚀");
});

/* 404 */
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ERROR */
app.use(errorHandler);

/* START */
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
