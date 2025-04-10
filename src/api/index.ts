const BASE_URL = 'http://localhost:5000/api';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': token } : {};
};

export const login = async (email: string, password: string) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }
  return response.json();
};

export const createReport = async (reportData: any) => {
  const response = await fetch(`${BASE_URL}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(reportData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create report');
  }
  return response.json();
};

export const postFiles = async (formData: FormData) => {
  const response = await fetch(`${BASE_URL}/files`, {
    method: 'POST',
    body: formData,
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to upload files');
  }
  return response.json();
};

export const postSupport = async (id: string) => {
  const response = await fetch(`${BASE_URL}/reports/${id}/support`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add support');
  }
  return response.json();
};

export const getReport = async (id: string) => {
  const response = await fetch(`${BASE_URL}/reports/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch report');
  }
  return response.json();
};


export const register = async (username: string, email: string, password: string) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }
  return response.json();
};

export const getReports = async () => {
  const response = await fetch(`${BASE_URL}/reports`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch reports');
  }
  return response.json();
};