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
      // Solo continuar al siguiente candidato si es 404 (endpoint no existe)
      if (error?.response?.status !== 404) {
        throw error;
      }
    }
  }

  throw lastError || new Error('No se pudo completar la operación.');
};

/**
 * Extrae el array de usuarios de la respuesta de la API.
 * El backend retorna: { exito: true, usuarios: [...] }
 */
const extractUsuarios = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.usuarios)) return data.usuarios;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export const getAlumnos = async () => {
  return requestWithFallback(['/alumnos', '/usuarios'], async (path) => {
    const response = await api.get(path);
    return extractUsuarios(response.data);
  });
};

export const getUsuarios = async () => {
  return requestWithFallback(['/alumnos', '/usuarios'], async (path) => {
    const response = await api.get(path);
    return extractUsuarios(response.data);
  });
};

export const crearAlumno = async (alumnoData) => {
  return requestWithFallback(['/alumnos', '/usuarios'], async (path) => {
    const response = await api.post(path, alumnoData);
    return response.data;
  });
};

export const registrarUsuario = async (usuarioData) => {
  return requestWithFallback(['/auth/register', '/auth/registro'], async (path) => {
    const response = await api.post(path, usuarioData);
    return response.data;
  });
};

export const autenticarUsuario = async (credenciales) => {
  return requestWithFallback(['/auth/login'], async (path) => {
    const response = await api.post(path, credenciales);
    return response.data;
  });
};

export const actualizarUsuario = async (id, usuarioData) => {
  return requestWithFallback([`/alumnos/${id}`, `/usuarios/${id}`], async (path) => {
    const response = await api.put(path, usuarioData);
    // Extraer el usuario del wrapper de respuesta
    return response.data?.usuario ?? response.data;
  });
};

export const toggleEstadoAlumno = async (id) => {
  return requestWithFallback([`/alumnos/${id}/estado`, `/usuarios/${id}/estado`], async (path) => {
    const response = await api.patch(path);
    return response.data?.usuario ?? response.data;
  });
};

export const cambiarContrasenaAlumno = async (id, nuevaContrasena) => {
  return requestWithFallback([`/alumnos/${id}/contrasena`, `/usuarios/${id}/contrasena`], async (path) => {
    const response = await api.patch(path, { nuevaContrasena });
    return response.data?.usuario ?? response.data;
  });
};
