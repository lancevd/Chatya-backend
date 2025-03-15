import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();
app.use(express.json());

const allowedOrigins = ["https://chatya.vercel.app", "http://localhost:3000"];

const PORT = process.env.PORT || 5001;
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log("Request origin:", req.headers.origin);
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
  console.log("Server is running on port:" + PORT);
  connectDB();
});
