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

const PORT = process.env.PORT || 5001;
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://chatya.vercel.app" || "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
  console.log("Server is running on port:" + PORT);
  connectDB();
});
