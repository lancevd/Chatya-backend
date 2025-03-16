// import mongoose from 'mongoose';

// export const connectDB = async () => {
//     try {
//         const conn = await mongoose.connect(process.env.MONGODB_URI);
//         console.log(`MongoDB Connected: ${conn.connection.host}`);
//     } catch (error) {
//         console.log("MongoDB Connection Failed", error);
//     }
// }

import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");
    console.log(
      "🔍 MONGODB_URI starts is:",
      process.env.MONGODB_URI || "NOT SET"
    );

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10s timeout
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};
