import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // Base URL de votre backend
});

export default axiosInstance;
