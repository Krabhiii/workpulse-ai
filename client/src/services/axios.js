import axios from "axios";

export const serverUrl =
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: serverUrl,
  withCredentials: true,
});

export default api;