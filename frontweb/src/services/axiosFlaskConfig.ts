// src/axiosFlaskConfig.ts
import axios from 'axios';

const axiosFlaskInstance = axios.create({
  baseURL: process.env.REACT_APP_FLASK_API_BASE_URL, // Utilisez la variable d'environnement
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosFlaskInstance;
