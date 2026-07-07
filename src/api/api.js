// src/api/api.js
// Centralized API client for Teamsync frontend, linking to the backend server
// Base URL points to the backend running on port 5000 (default).

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

export default apiClient;

// Example helper functions (optional)
export const getProjects = () => apiClient.get('/proyectos');
export const getProjectById = (id) => apiClient.get(`/proyectos/${id}`);
export const createProject = (data) => apiClient.post('/proyectos', data);
export const updateProject = (id, data) => apiClient.put(`/proyectos/${id}`, data);
export const deleteProject = (id) => apiClient.delete(`/proyectos/${id}`);
