import api from './api.js';

export const getProyectosByUsuario = async (userId) => {
  const response = await api.get(`/proyectos/usuario/${userId}`);
  return response.data;
};

export const crearProyecto = async (proyectoData) => {
  const response = await api.post('/proyectos', proyectoData);
  return response.data;
};

export const eliminarProyecto = async (id, userId) => {
  const response = await api.delete(`/proyectos/${id}`, { data: { userId } });
  return response.data;
};

export const unirseGrupoPorCodigo = async (codigo, userId) => {
  const response = await api.post('/proyectos/unirse', { codigo, userId });
  return response.data;
};

export const salirDeGrupo = async (id, userId) => {
  const response = await api.post(`/proyectos/${id}/salir`, { userId });
  return response.data;
};

export const quitarMiembro = async (id, miembroId, creadorId) => {
  const response = await api.post(`/proyectos/${id}/miembros/quitar`, { miembroId, creadorId });
  return response.data;
};

export const sincronizarTareas = async (id, tareas) => {
  const response = await api.put(`/proyectos/${id}/tareas`, { tareas });
  return response.data;
};

export const sincronizarRecursos = async (id, recursos) => {
  const response = await api.put(`/proyectos/${id}/recursos`, { recursos });
  return response.data;
};
