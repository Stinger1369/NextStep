import axiosSpringInstance from './axiosSpringConfig';

export const fetchUsers = () => {
  return axiosSpringInstance.get('/users');
};

export const fetchUserById = (userId: string) => {
  return axiosSpringInstance.get(`/users/${userId}`);
};

// Ajoutez d'autres appels API si nécessaire
