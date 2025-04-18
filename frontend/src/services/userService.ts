import api from './api';
import { User } from '@/types/user';

/**
 * Get all users
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('users', true);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await api.get(`users/${id}`, true);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

/**
 * Create user
 */
export const createUser = async (userData: {
  email: string;
  password: string;
  fullName?: string | null;
  isActive?: boolean;
  roleIds?: string[];
}): Promise<User> => {
  try {
    const response = await api.post('users', userData, true);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update user
 */
export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put(`users/${id}`, userData, true);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

/**
 * Delete user
 */
export const deleteUser = async (id: string): Promise<void> => {
  try {
    await api.delete(`users/${id}`, true);
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

/**
 * Get user roles
 */
export const getUserRoles = async (userId: string): Promise<any[]> => {
  try {
    const response = await api.get(`users/${userId}/roles`, true);
    return response.data;
  } catch (error) {
    console.error(`Error fetching roles for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Assign roles to user
 */
export const assignRolesToUser = async (userId: string, roleIds: string[]): Promise<any> => {
  try {
    const response = await api.post(`users/${userId}/roles`, { roleIds }, true);
    return response.data;
  } catch (error) {
    console.error(`Error assigning roles to user ${userId}:`, error);
    throw error;
  }
};

/**
 * Add role to user
 */
export const addRoleToUser = async (userId: string, roleId: string): Promise<any> => {
  try {
    const response = await api.post(`users/${userId}/roles/add`, { roleId }, true);
    return response.data;
  } catch (error) {
    console.error(`Error adding role to user ${userId}:`, error);
    throw error;
  }
};

/**
 * Remove role from user
 */
export const removeRoleFromUser = async (userId: string, roleId: string): Promise<any> => {
  try {
    const response = await api.post(`users/${userId}/roles/remove`, { roleId }, true);
    return response.data;
  } catch (error) {
    console.error(`Error removing role from user ${userId}:`, error);
    throw error;
  }
};
