import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import mongoose from "mongoose";

dotenv.config();

console.log("⚡ Starting Express Server...");

const allowedOrigins = ["https://chatya.vercel.app", "http://localhost:3000"];

const PORT = process.env.PORT || 5001;
console.log("🔵 PORT from .env or default:", PORT);

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log("🌍 Incoming request from:", req.headers.origin);
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("✅ CORS check for:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.get("/test-db", async (req, res) => {
  try {
    console.log("📡 Testing DB connection...");
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    res.json({ success: true, message: "Connected to MongoDB!" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});


console.log("🔗 Connecting to MongoDB...");
connectDB()
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port: ${PORT}`);
});
