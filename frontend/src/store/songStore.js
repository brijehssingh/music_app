import { create } from "zustand";
import API from "../services/api";

export const useSongStore = create((set, get) => ({
  allSongs: [],
  mySongs: [],
  artists: [],
  artistSongs: [],
  currentSong: null,
  uploadProgress: 0,
  user: null,
  loading: false,
  error: null,

  // Get current user
  getCurrentUser: async () => {
    try {
      const res = await API.get("/me");

      set({
        user: res.data?.user || null,
      });
    } catch (error) {
      console.log(
        "Get current user failed:",
        error.response?.data || error.message
      );

      set({
        user: null,
      });
    }
  },

  // Get artists
  getArtists: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await API.get("/artists");

      console.log("Artists response:", res.data);

      const artists = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.artists)
          ? res.data.artists
          : [];

      set({
        artists: artists,
        loading: false,
      });
    } catch (error) {
      console.log(
        "Get artists failed:",
        error.response?.data || error.message
      );

      set({
        artists: [],
        loading: false,
        error:
          error.response?.data?.message ||
          "Artists could not be loaded",
      });
    }
  },

  // Get artist songs
  getArtistSongs: async (id) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await API.get(`/artistSongs/${id}`);

      const songs = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.songs)
          ? res.data.songs
          : [];

      set({
        artistSongs: songs,
        loading: false,
      });
    } catch (error) {
      console.log(
        "Get artist songs failed:",
        error.response?.data || error.message
      );

      set({
        artistSongs: [],
        loading: false,
        error:
          error.response?.data?.message ||
          "Artist songs could not be loaded",
      });
    }
  },

  // Get all songs
  getAllSongs: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await API.get("/allsong");

      const songs = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.songs)
          ? res.data.songs
          : [];

      set({
        allSongs: songs,
        loading: false,
      });
    } catch (error) {
      console.log(
        "Get all songs failed:",
        error.response?.data || error.message
      );

      set({
        allSongs: [],
        loading: false,
        error:
          error.response?.data?.message ||
          "Songs could not be loaded",
      });
    }
  },

  // Get logged-in user's songs
  getSongs: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await API.get("/getMySongs");

      const songs = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.songs)
          ? res.data.songs
          : [];

      set({
        mySongs: songs,
        loading: false,
      });
    } catch (error) {
      console.log(
        "Get my songs failed:",
        error.response?.data || error.message
      );

      set({
        mySongs: [],
        loading: false,
        error:
          error.response?.data?.message ||
          "Your songs could not be loaded",
      });
    }
  },

  // Play song
  playSong: (song) => {
    set({
      currentSong: song,
    });
  },

  // Stop song
  stopSong: () => {
    set({
      currentSong: null,
    });
  },

  // Upload song
  uploadSong: async (formData) => {
    try {
      set({
        uploadProgress: 1,
        error: null,
      });

      const res = await API.post("/upload", formData, {
  timeout: 12000000,

  onUploadProgress: (progressEvent) => {
    if (!progressEvent.total) {
      return;
    }

    const percent = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );

    set({
      uploadProgress: percent,
    });
  },
});
      await Promise.all([
        get().getSongs(),
        get().getAllSongs(),
        get().getArtists(),
      ]);

      setTimeout(() => {
        set({
          uploadProgress: 0,
        });
      }, 1000);

      return {
        success: true,
        data: res.data,
      };
    } catch (error) {
      console.log(
        "Upload song failed:",
        error.response?.data || error.message
      );

      set({
        uploadProgress: 0,
        error:
          error.response?.data?.message ||
          "Song could not be uploaded",
      });

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Song upload failed",
      };
    }
  },

  // Delete song
  deleteSong: async (id) => {
    try {
      await API.delete(`/deletemusic/${id}`);

      set((state) => ({
        mySongs: state.mySongs.filter(
          (song) => song._id !== id
        ),

        allSongs: state.allSongs.filter(
          (song) => song._id !== id
        ),

        currentSong:
          state.currentSong?._id === id
            ? null
            : state.currentSong,
      }));

      await get().getArtists();

      return {
        success: true,
      };
    } catch (error) {
      console.log(
        "Delete song failed:",
        error.response?.data || error.message
      );

      set({
        error:
          error.response?.data?.message ||
          "Song could not be deleted",
      });

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Song delete failed",
      };
    }
  },

  // Clear error message
  clearError: () => {
    set({
      error: null,
    });
  },
}));