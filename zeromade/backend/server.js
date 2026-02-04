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

/* =============================
   Environment Variables
============================= */

const PORT = process.env.PORT || 5000;

// IMPORTANT: Set this in Render later
const CLIENT_URL =
  process.env.CLIENT_URL || "http://localhost:3000";

/* =============================
   Database Connection
============================= */

connectDB();

/* =============================
   Security Middlewares
============================= */

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

/* =============================
   CORS Configuration
============================= */

const allowedOrigins = [
  CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow server-to-server requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));

/* =============================
   Body Parsers
============================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =============================
   Rate Limiting
============================= */

app.use("/api/", apiLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

/* =============================
   API Routes
============================= */

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

/* =============================
   Health Check Route
============================= */

app.get("/", (req, res) => {
  res.send("Zeromade Backend Running 🚀");
});

app.get("/api/health", (req, res) =>
  res.json({
    success: true,
    message: "API running",
  })
);

/* =============================
   404 Handler
============================= */

app.use("/api/*", (req, res) =>
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
);

/* =============================
   Global Error Handler
============================= */

app.use(errorHandler);

/* =============================
   Start Server
============================= */

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

module.exports = app;
