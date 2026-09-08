import { Router } from "express";
import multer from "multer";

import {
  allSong,
  deletemusic,
  forgotPassword,
  getArtists,
  getArtistSongs,
  getCurrentUser,
  getMySongs,
  login,
  logout,
  musicUpload,
  resetPassword,
  searchSongs,
  signup,
} from "../controllers/controller.js";

const route = Router();

const allowedAudioTypes = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/x-m4a",
  "audio/ogg",
];

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 25 * 1024 * 1024,
  },

  fileFilter(req, file, callback) {
    if (!allowedAudioTypes.includes(file.mimetype)) {
      return callback(
        new Error(
          "Only MP3, WAV, M4A, and OGG audio files are allowed",
        ),
      );
    }

    return callback(null, true);
  },
});

route.post("/signup", signup);

route.post("/login", login);

route.post("/forgot-password", forgotPassword);

route.post("/reset-password", resetPassword);

route.get("/logout", logout);

route.get("/me", getCurrentUser);

route.post(
  "/upload",
  (req, res, next) => {
    upload.single("music")(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "Audio file must be smaller than 25 MB",
          });
        }

        return res.status(400).json({
          message: error.message,
        });
      }

      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }

      return next();
    });
  },
  musicUpload,
);

route.get("/allsong", allSong);

route.get("/getMySongs", getMySongs);

route.delete("/deletemusic/:id", deletemusic);

route.get("/artists", getArtists);

route.get("/artistSongs/:id", getArtistSongs);

route.get("/searchSongs/:id", searchSongs);

export default route;