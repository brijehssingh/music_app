import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    mimeType: {
      type: String,
      required: true,
      default: "audio/mpeg",
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },

    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const songModel = mongoose.model("songs", songSchema);

export default songModel;