import api from './api.js';

/**
 * Intenta cada ruta candidata en orden.
 * Solo pasa al siguiente candidato si el error es 404 (ruta no encontrada).
 * Para cualquier otro error (401, 400, 500, red) lanza inmediatamente.
 */
const requestWithFallback = async (candidates, executor) => {
  let lastError = null;

  for (const candidate of candidates) {
    try {
      return await executor(candidate);
    } catch (error) {
      lastError = error;
      if (error?.response?.status !== 404) {
        throw error;
      }
    }
  }

  throw lastError || new Error('No se pudo completar la operación de proyectos.');
};

// Extrae array de proyectos desde el wrapper de respuesta
const extractProyectos = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.proyectos)) return data.proyectos;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

// Extrae un proyecto individual del wrapper de respuesta
const extractProyecto = (data) => {
  return data?.proyecto ?? data?.data ?? data;
};

export const getProyectosByUsuario = async (userId) => {
  return requestWithFallback([`/proyectos/usuario/${userId}`], async (path) => {
    const response = await api.get(path);
    return extractProyectos(response.data);
  });
};

export const crearProyecto = async (proyectoData) => {
  return requestWithFallback(['/proyectos'], async (path) => {
    const response = await api.post(path, proyectoData);
    return extractProyecto(response.data);
  });
};

export const eliminarProyecto = async (id, userId) => {
  return requestWithFallback([`/proyectos/${id}`], async (path) => {
    const response = await api.delete(path, { userId });
    return response.data;
  });
};

export const unirseGrupoPorCodigo = async (codigo, userId) => {
  return requestWithFallback(['/proyectos/unirse'], async (path) => {
    const response = await api.post(path, { codigo, userId });
    // El backend retorna { exito, proyecto }
    return response.data;
  });
};

export const salirDeGrupo = async (id, userId) => {
  return requestWithFallback([`/proyectos/${id}/salir`], async (path) => {
    const response = await api.post(path, { userId });
    return response.data;
  });
};

export const quitarMiembro = async (id, miembroId, creadorId) => {
  return requestWithFallback([`/proyectos/${id}/miembros/quitar`], async (path) => {
    const response = await api.post(path, { miembroId, creadorId });
    return response.data;
  });
};

export const sincronizarTareas = async (id, tareas) => {
  return requestWithFallback([`/proyectos/${id}/tareas`], async (path) => {
    const response = await api.put(path, { tareas });
    return response.data;
  });
};

export const sincronizarRecursos = async (id, recursos) => {
  return requestWithFallback([`/proyectos/${id}/recursos`], async (path) => {
    const response = await api.put(path, { recursos });
    return response.data;
  });
};

export const actualizarProyecto = async (id, proyectoData) => {
  return requestWithFallback([`/proyectos/${id}`], async (path) => {
    const response = await api.put(path, proyectoData);
    return extractProyecto(response.data);
  });
};
