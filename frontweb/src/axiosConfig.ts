// src/axiosConfig.ts
import axios from 'axios';
import store from './redux/store';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Assurez-vous que le port est correct
  headers: {
    'Content-Type': 'application/json'
  }
});

// Ajouter un intercepteur de requête pour inclure le jeton d'autorisation
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token; // Obtenez le jeton du store Redux
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
