import axios from 'axios';

const axiosSpringInstance = axios.create({
  baseURL: process.env.REACT_APP_SPRING_API_BASE_URL, // Utilisez la variable d'environnement
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosSpringInstance;
