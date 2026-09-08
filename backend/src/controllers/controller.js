import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import userModel from "../models/user.js";
import songModel from "../models/songs.js";
import uploadFile from "../services/cloudinary.js";
import { sendOtpEmail } from "../services/mailService.js";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

function createToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }

  return jwt.sign(
    { user_id: user._id, user: user.user },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
}

function readToken(req) {
  const token = req.cookies?.token;

  if (!token) {
    const error = new Error("Please log in first");
    error.status = 401;
    throw error;
  }

  return jwt.verify(token, process.env.JWT_SECRET);
}

function safeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    user: user.user,
  };
}

function sendControllerError(res, error, fallbackMessage) {
  if (
    error.status === 401 ||
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    return res.status(401).json({ message: "Your session has expired. Please log in again." });
  }

  console.error(`${fallbackMessage}:`, error.message);
  return res.status(error.status || 500).json({
    message: error.status ? error.message : fallbackMessage,
  });
}

export async function signup(req, res) {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    // New accounts register as standard listeners; premium is unlocked via payment gateway
    const accountType = "normal";

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await userModel.findOne({
      $or: [{ email }, { name }],
    });

    if (existingUser) {
      return res.status(409).json({ message: "A user with this name or email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      name,
      email,
      password: hash,
      user: accountType,
    });

    const token = createToken(newUser);
    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "Account created successfully",
      user: safeUser(newUser),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "This email is already registered" });
    }

    return sendControllerError(res, error, "Account could not be created");
  }
}

export async function login(req, res) {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createToken(user);
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Login successful",
      user: safeUser(user),
    });
  } catch (error) {
    return sendControllerError(res, error, "Login failed");
  }
}

export async function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}

export async function musicUpload(req, res) {
  try {
    const decoded = readToken(req);

    if (decoded.user !== "premium") {
      return res.status(403).json({
        message: "Only premium users can upload songs",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please select an audio file",
      });
    }

    const name = req.body.name?.trim();
    const comment = req.body.comment?.trim() || "";

    if (!name) {
      return res.status(400).json({
        message: "Song name is required",
      });
    }

    console.log("Uploading audio:", {
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });

    // Important: send raw Buffer, not a Base64 string.
    const result = await uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
    );

    const music = await songModel.create({
      name,
      url: result.url,
      mimeType: req.file.mimetype,
      comment,
      artist: decoded.user_id,
    });

    return res.status(201).json({
      success: true,
      message: "Song uploaded successfully",
      music,
    });
  } catch (error) {
    console.error("SONG UPLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Song upload failed"
          : error.message || "Song upload failed",
    });
  }
}
export async function deletemusic(req, res) {
  try {
    const decoded = readToken(req);

    if (decoded.user !== "premium") {
      return res.status(403).json({ message: "Only premium users can delete songs" });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid song id" });
    }

    const song = await songModel.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    if (song.artist.toString() !== decoded.user_id) {
      return res.status(403).json({ message: "You can delete only your own songs" });
    }

    await song.deleteOne();
    return res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    return sendControllerError(res, error, "Song could not be deleted");
  }
}

export async function getMySongs(req, res) {
  try {
    const decoded = readToken(req);
    const songs = await songModel
      .find({ artist: decoded.user_id })
      .sort({ createdAt: -1 });

    return res.status(200).json({ songs });
  } catch (error) {
    return sendControllerError(res, error, "Your songs could not be loaded");
  }
}

export async function allSong(req, res) {
  try {
    const songs = await songModel.find().sort({ createdAt: -1 });
    return res.status(200).json({ songs });
  } catch (error) {
    return sendControllerError(res, error, "Songs could not be loaded");
  }
}

export async function getArtists(req, res) {
  try {
    const artists = await songModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "artist",
          foreignField: "_id",
          as: "artist",
        },
      },
      { $unwind: "$artist" },
      {
        $group: {
          _id: "$artist._id",
          artistName: { $first: "$artist.name" },
          songsCount: { $sum: 1 },
        },
      },
      { $sort: { songsCount: -1, artistName: 1 } },
    ]);

    return res.status(200).json({ artists });
  } catch (error) {
    return sendControllerError(res, error, "Artists could not be loaded");
  }
}

export async function getArtistSongs(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid artist id" });
    }

    const songs = await songModel
      .find({ artist: req.params.id })
      .sort({ createdAt: -1 });

    return res.status(200).json({ songs });
  } catch (error) {
    return sendControllerError(res, error, "Artist songs could not be loaded");
  }
}

export async function getCurrentUser(req, res) {
  try {
    const decoded = readToken(req);
    const user = await userModel.findById(decoded.user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user: safeUser(user) });
  } catch (error) {
    return sendControllerError(res, error, "User session could not be loaded");
  }
}

export async function searchSongs(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid artist id" });
    }

    const query = String(req.query.query || "").trim();
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const songs = await songModel.find({
      artist: req.params.id,
      name: { $regex: safeQuery, $options: "i" },
    });

    return res.status(200).json({ songs });
  } catch (error) {
    return sendControllerError(res, error, "Search failed");
  }
}

export async function forgotPassword(req, res) {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address",
      });
    }

    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = expiresAt;
    await user.save();

    console.log("\n=======================================================");
    console.log(`🔑 [AUTH OTP GENERATED] For: ${user.email} -> OTP: ${otp}`);
    console.log("=======================================================\n");

    try {
      await sendOtpEmail({
        toEmail: user.email,
        otp,
        userName: user.name,
      });
    } catch (mailError) {
      console.error("[FORGOT-PASSWORD] Email delivery failed:", mailError.message);
      return res.status(503).json({
        success: false,
        message:
          "Email server could not deliver the code (Free cloud hosts like Render block SMTP ports 587/465). Check backend server console for the active OTP.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email address",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return sendControllerError(res, error, "Could not send verification email");
  }
}

export async function resetPassword(req, res) {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const otp = String(req.body.otp || "").trim();
    const newPassword = req.body.newPassword;

    console.log(`[RESET PASSWORD ATTEMPT] Email: ${email}, OTP entered: ${otp}`);

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, verification OTP, and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const user = await userModel
      .findOne({ email })
      .select("+resetPasswordOtp +resetPasswordExpires");

    if (!user || !user.resetPasswordOtp || !user.resetPasswordExpires) {
      return res.status(400).json({
        success: false,
        message: "No active password reset request found. Please request a new code.",
      });
    }

    if (new Date() > user.resetPasswordExpires) {
      user.resetPasswordOtp = null;
      user.resetPasswordExpires = null;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new one.",
      });
    }

    const storedOtp = String(user.resetPasswordOtp).trim();
    let isMatch = false;

    // Support both plain text OTP and bcrypt hashed OTP
    if (
      storedOtp.startsWith("$2b$") ||
      storedOtp.startsWith("$2a$") ||
      storedOtp.startsWith("$2y$")
    ) {
      isMatch = await bcrypt.compare(otp, storedOtp);
    } else {
      isMatch = storedOtp === otp;
    }

    console.log(
      `[RESET PASSWORD CHECK] Match: ${isMatch} (Entered: "${otp}", DB: "${storedOtp}")`
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code. Please check and try again.",
      });
    }

    // Hash new password and clear reset fields
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOtp = null;
    user.resetPasswordExpires = null;
    await user.save();

    console.log(
      `[RESET PASSWORD SUCCESS] Password successfully updated for ${email}`
    );

    return res.status(200).json({
      success: true,
      message:
        "Password reset successful! You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return sendControllerError(res, error, "Could not reset password");
  }
}

