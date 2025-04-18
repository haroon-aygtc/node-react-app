import api from './api';
import { Role, Permission } from '@/types/role';

/**
 * Get all roles
 */
export const getAllRoles = async (): Promise<Role[]> => {
  try {
    const response = await api.get('roles', true);

    // Check if response.data is an array
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // If response.data is not an array but has a data property that is an array
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    // If we can't find an array, log the response and return an empty array
    console.warn('Unexpected roles response format:', response);
    return [];
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

/**
 * Get role by ID
 */
export const getRoleById = async (id: string): Promise<Role> => {
  try {
    const response = await api.get(`roles/${id}`, true);
    return response.data;
  } catch (error) {
    console.error(`Error fetching role ${id}:`, error);
    throw error;
  }
};

/**
 * Create role
 */
export const createRole = async (roleData: {
  name: string;
  description?: string;
  isDefault?: boolean;
  permissionIds?: string[];
}): Promise<Role> => {
  try {
    const response = await api.post('roles', roleData, true);
    return response.data;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

/**
 * Update role
 */
export const updateRole = async (id: string, roleData: {
  name?: string;
  description?: string;
  isDefault?: boolean;
  permissionIds?: string[];
}): Promise<Role> => {
  try {
    const response = await api.put(`roles/${id}`, roleData, true);
    return response.data;
  } catch (error) {
    console.error(`Error updating role ${id}:`, error);
    throw error;
  }
};

/**
 * Delete role
 */
export const deleteRole = async (id: string): Promise<void> => {
  try {
    await api.delete(`roles/${id}`, true);
  } catch (error) {
    console.error(`Error deleting role ${id}:`, error);
    throw error;
  }
};

/**
 * Get all permissions
 */
export const getAllPermissions = async (): Promise<Permission[]> => {
  try {
    const response = await api.get('roles/permissions/all', true);
    return response.data;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
};

/**
 * Get permission by ID
 */
export const getPermissionById = async (id: string): Promise<Permission> => {
  try {
    const response = await api.get(`roles/permissions/${id}`, true);
    return response.data;
  } catch (error) {
    console.error(`Error fetching permission ${id}:`, error);
    throw error;
  }
};

/**
 * Assign permissions to role
 */
export const assignPermissionsToRole = async (roleId: string, permissionIds: string[]): Promise<any> => {
  try {
    const response = await api.post('roles/permissions/assign', { roleId, permissionIds }, true);
    return response.data;
  } catch (error) {
    console.error(`Error assigning permissions to role ${roleId}:`, error);
    throw error;
  }
};

/**
 * Get users by role ID
 */
export const getUsersByRoleId = async (roleId: string): Promise<any[]> => {
  try {
    const response = await api.get(`roles/${roleId}/users`, true);

    // Check if response.data is an array
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // If response.data is not an array but has a data property that is an array
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    // If we can't find an array, log the response and return an empty array
    console.warn(`Unexpected users response format for role ${roleId}:`, response);
    return [];
  } catch (error) {
    console.error(`Error fetching users for role ${roleId}:`, error);
    return []; // Return empty array on error to prevent UI issues
  }
};

/**
 * Assign role to user
 */
export const assignRoleToUser = async (roleId: string, userId: string): Promise<any> => {
  try {
    const response = await api.post(`roles/${roleId}/users`, { userId }, true);
    return response.data;
  } catch (error) {
    console.error(`Error assigning role ${roleId} to user ${userId}:`, error);
    throw error;
  }
};

/**
 * Remove role from user
 */
export const removeRoleFromUser = async (roleId: string, userId: string): Promise<any> => {
  try {
    const response = await api.post(`roles/${roleId}/users/remove`, { userId }, true);
    return response.data;
  } catch (error) {
    console.error(`Error removing role ${roleId} from user ${userId}:`, error);
    throw error;
  }
};
