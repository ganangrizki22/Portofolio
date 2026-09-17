import axios from "axios";

// Semua request ke backend Express lewat instance axios ini.
// URL diatur lewat variabel environment VITE_API_BASE_URL (lihat .env.example).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProfile = () => api.get("/profile").then((res) => res.data.data);

export const getSkills = () => api.get("/skills").then((res) => res.data.data);

export const getExperience = () =>
  api.get("/experience").then((res) => res.data.data);

export const getProjects = () => api.get("/projects").then((res) => res.data.data);

export const sendContactMessage = (payload) =>
  api.post("/contact", payload).then((res) => res.data);

export const getSpotifyNowPlaying = () =>
  api.get("/spotify/now-playing").then((res) => res.data.data);

export const getStoreProducts = () =>
  api.get("/products").then((res) => res.data.data);

export default api;
