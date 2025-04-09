import { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '@/types/auth';
import api from './api';

// Login user
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    // Send login request
    const response = await api.post('auth/login', credentials);

    // The backend returns { status, message, data: { user, token } }
    // Extract user and token from the data property
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register user
export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await api.post('auth/register', userData);
    // The backend returns { status, message, data: { user, token } }
    return response.data;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get('auth/me', true);
    // The backend returns { status, message, data: user }
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

// Logout user (client-side only)
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
