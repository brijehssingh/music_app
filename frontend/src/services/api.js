import axios from "axios";

const serverUrl =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const API = axios.create({
  baseURL: `${serverUrl.replace(/\/$/, "")}/api/auth`,
  withCredentials: true,

  // Wait up to 2 minutes
  timeout: 120000,
});

export default API;