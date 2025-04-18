import api from './api';
import { Permission } from '@/types/role';

/**
 * Get all permissions
 */
export const getAllPermissions = async (): Promise<Permission[]> => {
  try {
    // Try the permissions endpoint first
    try {
      const response = await api.get('permissions', true);

      // Check if response.data is an array
      if (Array.isArray(response.data)) {
        return response.data;
      }

      // If response.data is not an array but has a data property that is an array
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      // If we can't find an array in the permissions endpoint, try the roles endpoint
      throw new Error('Invalid response format from permissions endpoint');
    } catch (permissionsError) {
      console.warn('Error fetching from permissions endpoint, trying roles endpoint:', permissionsError);

      // Try the roles/permissions/all endpoint as fallback
      const response = await api.get('roles/permissions/all', true);

      // Check if response.data is an array
      if (Array.isArray(response.data)) {
        return response.data;
      }

      // If response.data is not an array but has a data property that is an array
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      // If we still can't find an array, log the response and return an empty array
      console.warn('Unexpected permissions response format from roles endpoint:', response);
      return [];
    }
  } catch (error) {
    console.error('Error fetching permissions from all endpoints:', error);
    return []; // Return empty array to prevent UI issues
  }
};

/**
 * Get permission by ID
 */
export const getPermissionById = async (id: string): Promise<Permission> => {
  try {
    const response = await api.get(`permissions/${id}`, true);
    return response.data;
  } catch (error) {
    console.error(`Error fetching permission ${id}:`, error);
    throw error;
  }
};

/**
 * Get permissions by IDs
 */
export const getPermissionsByIds = async (ids: string[]): Promise<Permission[]> => {
  try {
    // Try the new endpoint first
    try {
      const response = await api.post('permissions/by-ids', { ids }, true);
      return response.data;
    } catch (firstError) {
      // If the new endpoint fails, try the old one as fallback
      console.warn('New permissions/by-ids endpoint failed, trying fallback:', firstError);
      const response = await api.post('permissions/ids', { ids }, true);
      return response.data;
    }
  } catch (error) {
    console.error('Error fetching permissions by IDs:', error);
    throw error;
  }
};

/**
 * Get permissions by category
 */
export const getPermissionsByCategory = async (category: string): Promise<Permission[]> => {
  try {
    const response = await api.get(`permissions/category/${category}`, true);

    // Check if response.data is an array
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // If response.data is not an array but has a data property that is an array
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    // If we can't find an array, try to get all permissions and filter by category
    console.warn(`Unexpected response format for category ${category}, trying to filter all permissions`);
    const allPermissions = await getAllPermissions();
    return allPermissions.filter(p => p.category?.toLowerCase() === category.toLowerCase());
  } catch (error) {
    console.error(`Error fetching permissions for category ${category}:`, error);

    // Try to get all permissions and filter by category as a fallback
    try {
      const allPermissions = await getAllPermissions();
      return allPermissions.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return []; // Return empty array to prevent UI issues
    }
  }
};

/**
 * Assign permission to role
 */
export const assignPermissionToRole = async (roleId: string, permissionId: string): Promise<any> => {
  try {
    // Try the new endpoint first
    try {
      const response = await api.post('permissions/role/assign', { roleId, permissionId }, true);
      return response.data;
    } catch (firstError) {
      // If the new endpoint fails, try the old one as fallback
      console.warn('New permissions/role/assign endpoint failed, trying fallback:', firstError);
      const response = await api.post('permissions/assign-role', { roleId, permissionId }, true);
      return response.data;
    }
  } catch (error) {
    console.error(`Error assigning permission ${permissionId} to role ${roleId}:`, error);
    throw error;
  }
};

/**
 * Assign multiple permissions to role
 */
export const assignPermissionsToRole = async (roleId: string, permissionIds: string[]): Promise<any> => {
  try {
    // Try the new endpoint first
    try {
      const response = await api.post('permissions/role/assign-multiple', { roleId, permissionIds }, true);
      return response.data;
    } catch (firstError) {
      // If the new endpoint fails, try the old one as fallback
      console.warn('New permissions/role/assign-multiple endpoint failed, trying fallback:', firstError);
      const response = await api.post('permissions/assign-multiple', { roleId, permissionIds }, true);
      return response.data;
    }
  } catch (error) {
    console.error(`Error assigning permissions to role ${roleId}:`, error);
    throw error;
  }
};

/**
 * Get role permissions
 */
export const getRolePermissions = async (roleId: string): Promise<Permission[]> => {
  try {
    const response = await api.get(`permissions/role/${roleId}`, true);
    return response.data;
  } catch (error) {
    console.error(`Error fetching permissions for role ${roleId}:`, error);
    throw error;
  }
};

/**
 * Remove permission from role
 */
export const removePermissionFromRole = async (roleId: string, permissionId: string): Promise<any> => {
  try {
    const response = await api.delete(`permissions/role/${roleId}/permission/${permissionId}`, true);
    return response.data;
  } catch (error) {
    console.error(`Error removing permission ${permissionId} from role ${roleId}:`, error);
    throw error;
  }
};

/**
 * Assign permissions to user
 */
export const assignPermissionsToUser = async (userId: string, permissionIds: string[]): Promise<any> => {
  try {
    // Try the new endpoint first
    try {
      const response = await api.post('permissions/user/assign', { userId, permissionIds }, true);
      return response.data;
    } catch (firstError) {
      // If the new endpoint fails, try the old one as fallback
      console.warn('New permissions/user/assign endpoint failed, trying fallback:', firstError);
      const response = await api.post('permissions/assign-user', { userId, permissionIds }, true);
      return response.data;
    }
  } catch (error) {
    console.error(`Error assigning permissions to user ${userId}:`, error);
    throw error;
  }
};
