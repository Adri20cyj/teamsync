import api from './api.js';

export const getAlumnos = async () => {
  const response = await api.get('/alumnos');
  return response.data;
};

export const toggleEstadoAlumno = async (id) => {
  const response = await api.put(`/alumnos/${id}/estado`);
  return response.data;
};

export const cambiarContrasenaAlumno = async (id, nuevaContrasena) => {
  const response = await api.put(`/alumnos/${id}/contrasena`, { nuevaContrasena });
  return response.data;
};
