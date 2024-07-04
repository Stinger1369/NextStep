import axiosSpringInstance from './axiosSpringConfig';

export const fetchUsers = () => {
  return axiosSpringInstance.get('/users');
};

export const fetchUserById = (userId: string) => {
  return axiosSpringInstance.get(`/users/${userId}`);
};

export const createUser = (user: any) => {
  return axiosSpringInstance.post('/users', user);
};

export const updateUser = (userId: string, user: any) => {
  return axiosSpringInstance.put(`/users/${userId}`, user);
};

export const deleteUser = (userId: string) => {
  return axiosSpringInstance.delete(`/users/${userId}`);
};

// Ajoutez d'autres appels API si nécessaire
