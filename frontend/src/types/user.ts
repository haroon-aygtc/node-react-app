import { Role } from './role';

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  isActive: boolean;
  emailVerified: boolean;
  avatarUrl: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  roles?: Role[];
}

export interface UserWithRoles extends User {
  roles: Role[];
}

export interface UserRole {
  userId: string;
  roleId: string;
  assignedAt: string;
  assignedBy: string | null;
  createdAt: string;
  role?: Role;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserCreateRequest {
  email: string;
  password: string;
  fullName?: string;
  isActive?: boolean;
  emailVerified?: boolean;
  avatarUrl?: string;
  roleIds?: string[];
}

export interface UserUpdateRequest {
  email?: string;
  fullName?: string;
  isActive?: boolean;
  emailVerified?: boolean;
  avatarUrl?: string;
  roleIds?: string[];
}
