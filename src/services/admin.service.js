import api from './api.js';

export const adminLogin = async (email, contrasena) => {
  const response = await api.post('/auth/login', { email, contrasena });
  return response.data;
};
