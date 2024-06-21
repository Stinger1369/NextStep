// src/axiosConfig.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Assurez-vous que le port est correct
});

export default axiosInstance;
