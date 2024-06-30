// src/axiosFlaskConfig.ts
import axios from 'axios';

const axiosFlaskInstance = axios.create({
  baseURL: 'http://localhost:8001', // URL du backend Flask
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosFlaskInstance;
