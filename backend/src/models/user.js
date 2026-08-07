

import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({

  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  user: {
    type: String,
    enum: ["normal", "premium"],
    default: "normal",
  },

}, { timestamps: true });

const userModel = mongoose.model("users", userSchema);

export default userModel;
