import axios from 'axios';

const API_KEY = '06b30677-6927-43d1-a668-c7a5379c126f';

const axiosSpringInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'API-Key': API_KEY
  }
});

export default axiosSpringInstance;
