import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";
import emailRoutes from "./routes/email.js";
import bookingRoutes from "./routes/bookings.js";
import authRoutes from "./routes/auth.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// CORS configuration - Allow requests from your Netlify frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://localhost:5173",
  "http://localhost:5174",
  "https://localhost:5174",
  "http://localhost:3000",
  "https://appointmentbooking-fullstack.netlify.app",
   "https://sampurnamanovikas.in",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log("Origin:", req.get("Origin"));
  console.log("Headers:", req.headers);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    cors_origins: allowedOrigins,
  });
});

// Test email endpoint
app.get("/test-email", async (req, res) => {
  try {
    const { testEmailConfiguration } = await import(
      "./services/emailService.js"
    );
    const result = await testEmailConfiguration();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Email test failed",
      error: error.message,
    });
  }
});

// Test OTP endpoint (for development only)
app.get("/test-otp/:email", async (req, res) => {
  try {
    if (process.env.NODE_ENV !== "development") {
      return res.status(403).json({ message: "Not available in production" });
    }

    const User = (await import("./models/User.js")).default;
    const user = await User.findOne({ email: req.params.email }).select(
      "+otp +otpExpires"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      email: user.email,
      otp: user.otp,
      otpExpires: user.otpExpires,
      isExpired: user.otpExpires < Date.now(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/bookings", bookingRoutes);

// Catch-all for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 Allowed CORS origins:`, allowedOrigins);
  console.log(`📧 SMTP configured for:`, process.env.SMTP_USER);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});
