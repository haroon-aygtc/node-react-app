export interface Role {
  id: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  permissions?: Permission[];
  rolePermissions?: RolePermission[];
  userCount?: number; // Add userCount property
}

export interface Permission {
  id: string;
  name: string;
  description: string | null;
  category: string;
  action: string;
  createdAt: string;
  updatedAt: string;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
  assignedAt: string;
  assignedBy: string | null;
  createdAt: string;
  permission?: Permission;
}

export interface RoleCreateRequest {
  name: string;
  description?: string;
  isDefault?: boolean;
  permissionIds?: string[];
}

export interface RoleUpdateRequest {
  name?: string;
  description?: string;
  isDefault?: boolean;
  permissionIds?: string[];
}

export interface PermissionCreateRequest {
  name: string;
  description?: string;
  category: string;
  action: string;
}

export interface PermissionUpdateRequest {
  name?: string;
  description?: string;
  category?: string;
  action?: string;
}

export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}
