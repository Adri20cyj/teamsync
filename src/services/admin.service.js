import api from './api.js';

export const adminLogin = async (email, contrasena) => {
  // Lanzar error inmediatamente para cualquier error que no sea 404
  try {
    const response = await api.post('/auth/admin/login', { email, contrasena });
    return response.data;
  } catch (error) {
    // Solo continuar si el endpoint no existe (404)
    if (error?.response?.status !== 404) {
      throw error;
    }
  }

  // Fallback si /auth/admin/login no existe
  const response = await api.post('/admin/login', { email, contrasena });
  return response.data;
};
