import * as roleRepository from '../repositories/roleRepository.js';
import type { Permission, Role } from '../models/index.js';
import { NotFoundError } from '../utils/errors.js';
import { safeNumberId } from '../utils/typeConverters.js';

export async function getAllPermissions(): Promise<Permission[]> {
    return roleRepository.getAllPermissions();
}

export async function getPermissionById(id: number): Promise<Permission> {
    const permission = await roleRepository.getPermissionById(safeNumberId(id));
    if (!permission) throw new NotFoundError('Permission not found');
    return permission;
}

export async function getPermissionsByIds(ids: number[]): Promise<Permission[]> {
    return roleRepository.getPermissionsByIds(ids);
}

export async function getRoleById(id: number): Promise<Role> {
    const role = await roleRepository.getRoleById(safeNumberId(id));
    if (!role) throw new NotFoundError('Role not found');
    return role;
}

export async function getAllRoles(): Promise<Role[]> {
    return roleRepository.getAllRoles();
}
