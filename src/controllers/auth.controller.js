import { get } from "mongoose";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const payload = req.body;

  try {
    if (payload.password.length < 5) {
      return res.status(400).json({
        message: "Password must be at least 5 characters!",
      });
    }

    const email = payload.email.toLowerCase();
    const user = await User.findOne({ email });

    if (!payload.email || !payload.password || !payload.fullName) {
      return res.status(400).json({
        message: "Please fill in all fields.",
      });
    }
    if (user) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(payload.password, salt);

    const newUser = new User({
      fullName: payload.fullName,
      email: payload.email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      return res.status(201).json({
        ...newUser._doc,
        password: undefined,
      });
    }
  } catch (error) {
    console.log("Register controller error", error);
    return res.status(500).json({
      message: `Server error: ${error}`,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!password || !email) {
      return res.status(400).json({
        message: "Please fill in all fields.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials.",
      });
    }

    generateToken(user._id, res);

    return res.status(200).json({
      ...user._doc,
      password: undefined,
    });
  } catch (error) {
    console.log("Login controller error", error);
    return res.status(500).json({
      message: `Server error: ${error}`,
    });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      maxAge: 0,
    });
    res.status(200).json({
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.log("Logout controller error", error);
    return res.status(500).json({
      message: `Server error: ${error}`,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({
        message: "Please upload a profile picture.",
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(userId, {
      profilePic: uploadResponse.secure_url,
    });

    return res.status(200).json({
      ...updatedUser._doc,
      password: undefined,
    });
  } catch (error) {
    console.log("Update profile controller error", error);
    return res.status(500).json({
      message: `Server error: ${error}`,
    });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    console.log("Check auth controller error", error.message);
    res.status(500).json({
      message: `Internal server error: ${error}`,
    });
  }
};
