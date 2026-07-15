const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace(/\/$/, '');

const buildUrl = (path, query) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${BASE_URL}${normalizedPath}`);

  if (query && typeof query === 'object') {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
};

const normalizeBody = (body) => {
  if (body === undefined || body === null) return undefined;
  if (body instanceof FormData) return body;
  return JSON.stringify(body);
};

const request = async (method, path, body, options = {}) => {
  const headers = new Headers(options.headers || {});
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

  if (!(body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response;
  try {
    response = await fetch(buildUrl(path, options.query), {
      method,
      headers,
      body: normalizeBody(body),
      signal: options.signal,
      // No usar 'include' para evitar conflictos CORS con backends que usan '*'
      credentials: options.credentials || 'same-origin'
    });
  } catch (error) {
    const networkError = new Error('No se pudo conectar con el backend. Verifica que el servidor esté disponible.');
    networkError.cause = error;
    throw networkError;
  }

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const error = new Error(
      data?.mensaje || data?.message || data?.error || `HTTP ${response.status}`
    );
    error.response = { status: response.status, data };
    throw error;
  }

  return { data, response };
};

const api = {
  get: (path, options = {}) => request('GET', path, undefined, options),
  post: (path, body, options = {}) => request('POST', path, body, options),
  put: (path, body, options = {}) => request('PUT', path, body, options),
  patch: (path, body, options = {}) => request('PATCH', path, body, options),
  delete: (path, body, options = {}) => request('DELETE', path, body, options)
};

export default api;
export { BASE_URL };