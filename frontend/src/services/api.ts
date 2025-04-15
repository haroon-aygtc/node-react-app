/**
 * API Service
 * Centralized service for making API requests
 */

// When using Vite proxy, we can use relative URLs
// This will be automatically proxied to the backend
const API_URL = '/api';

// Default request headers
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  // Log the raw response for debugging
  console.log('Raw API response:', {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries([...response.headers.entries()])
  });

  // Clone the response to read it multiple times if needed
  const clonedResponse = response.clone();

  try {
    // Try to parse the response as JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('API response data (JSON):', data);
    } else {
      // If not JSON, get the text content
      const textContent = await response.text();
      console.log('API response data (Text):', textContent);
      // Try to parse it as JSON anyway in case the content-type header is wrong
      try {
        data = JSON.parse(textContent);
        console.log('Parsed text as JSON:', data);
      } catch (e) {
        console.log('Could not parse text as JSON, using as is');
        data = { message: textContent };
      }
    }

    if (!response.ok) {
      // Extract error message from response
      const errorMessage = data.error?.message || data.message || 'Something went wrong';
      console.error('API error response:', { status: response.status, message: errorMessage, data });
      throw new Error(errorMessage);
    }

    // Check for application-level errors
    if (data.status === 'error') {
      console.error('Application error:', data);
      throw new Error(data.message || 'Application error');
    }

    return data;
  } catch (error) {
    // If JSON parsing fails, try to get the text content
    if (error instanceof SyntaxError) {
      const textContent = await clonedResponse.text();
      console.error('Failed to parse JSON response:', { textContent });
      throw new Error('Invalid response format from server');
    }
    throw error;
  }
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

    // Log the request details for debugging
    console.log(`Making ${method} request to ${url}`, {
      headers: options.headers,
      body: method !== 'GET' && data ? data : undefined
    });

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
