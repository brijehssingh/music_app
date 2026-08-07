import { create } from "zustand";
import API from "../services/api";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  error: null,

  checkAuth: async () => {
    try {
      const response = await API.get("/me");
      set({ user: response.data.user, checkingAuth: false });
    } catch {
      set({ user: null, checkingAuth: false });
    }
  },

  signup: async (data) => {
    try {
      set({ loading: true, error: null });
      const response = await API.post("/signup", data);
      set({ user: response.data.user, loading: false });
      return { success: true };
    } catch (error) {
      const message = getErrorMessage(error, "Account could not be created");
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const response = await API.post("/login", { email, password });
      set({ user: response.data.user, loading: false });
      return { success: true };
    } catch (error) {
      const message = getErrorMessage(error, "Login failed");
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  logout: async () => {
    try {
      await API.get("/logout");
    } finally {
      set({ user: null, error: null });
    }
  },

  clearError: () => set({ error: null }),
}));
