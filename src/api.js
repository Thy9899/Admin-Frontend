// src/api.js
import axios from "axios";

// Get token from localStorage (after login)
const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
