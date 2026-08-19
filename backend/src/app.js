import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import route from "./auth/auth.js";

const app = express();

// Allowed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://music-app-jelm.vercel.app",
];

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman, Thunder Client and server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      // Allow configured URLs
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow any localhost port during development
      const isLocalhost =
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);

      if (isLocalhost) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked this origin: ${origin}`));
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  }),
);

// Body and cookie middleware
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health-check route
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Backend is running",
  });
});

// Authentication and music routes
app.use("/api/auth", route);

// Route not found
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  console.error("Server error:", error.message);

  if (error.message?.includes("CORS")) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Server error",
  });
});

export default app;