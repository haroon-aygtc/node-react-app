/**
 * API Service
 * Centralized service for making API requests
 */

// Get API URL from environment variables or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Default request headers
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  console.log('API response:', { status: response.status, data });

  if (!response.ok) {
    // Extract error message from response
    const errorMessage = data.message || 'Something went wrong';
    console.error('API error response:', { status: response.status, message: errorMessage });
    throw new Error(errorMessage);
  }

  // Check for application-level errors
  if (data.status === 'error') {
    console.error('Application error:', data.message);
    throw new Error(data.message || 'Application error');
  }

  return data;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * API request function
 * @param endpoint - API endpoint (without base URL)
 * @param method - HTTP method
 * @param data - Request body data
 * @param requiresAuth - Whether the request requires authentication
 * @returns Promise with response data
 */
export const apiRequest = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  data: any = null,
  requiresAuth: boolean = false
) => {
  try {
    // Build request URL
    const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    // Build request headers
    const headers = {
      ...defaultHeaders,
      ...(requiresAuth ? getAuthHeaders() : {}),
    };

    // Build request options
    const options: RequestInit = {
      method,
      headers,
      credentials: 'include', // Include cookies for cross-origin requests
    };

    // Add request body for non-GET requests
    if (method !== 'GET' && data) {
      options.body = JSON.stringify(data);
    }

    // Make the request
    const response = await fetch(url, options);

    // Handle the response
    return await handleResponse(response);
  } catch (error) {
    console.error(`API ${method} request to ${endpoint} failed:`, error);
    throw error;
  }
};

// Export convenience methods
export const get = (endpoint: string, requiresAuth: boolean = false) =>
  apiRequest(endpoint, 'GET', null, requiresAuth);

export const post = (endpoint: string, data: any, requiresAuth: boolean = false) =>
  apiRequest(endpoint, 'POST', data, requiresAuth);

export const put = (endpoint: string, data: any, requiresAuth: boolean = false) =>
  apiRequest(endpoint, 'PUT', data, requiresAuth);

export const del = (endpoint: string, requiresAuth: boolean = false) =>
  apiRequest(endpoint, 'DELETE', null, requiresAuth);

export const patch = (endpoint: string, data: any, requiresAuth: boolean = false) =>
  apiRequest(endpoint, 'PATCH', data, requiresAuth);

export default {
  get,
  post,
  put,
  delete: del,
  patch,
};
