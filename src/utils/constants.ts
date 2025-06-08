// src/constants.ts

// Load base URL from environment variable
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  EMPLOYEES: `${API_BASE_URL}/employees`,
  TASKS: `${API_BASE_URL}/tasks`,
  SALARIES: `${API_BASE_URL}/salaries`,
};

export const QUERY_KEYS = {
  EMPLOYEES: 'employees',
  TASKS: 'tasks',
  SALARIES: 'salaries',
  USER: 'user',
};
