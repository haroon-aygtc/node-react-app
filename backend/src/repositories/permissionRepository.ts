import prisma from '../config/prisma.js';
import type { Permission, RolePermission } from '../models/index.js';
import { convertEntityId, convertEntityIds, idParam, safeNumberId } from '../utils/typeConverters.js';

export async function getAllPermissions(): Promise<Permission[]> {
    const results = await prisma.permission.findMany({
        include: {
            rolePermissions: {
                select: {
                    roleId: true,
                    permissionId: true,
                    assignedAt: true,
                    assignedBy: true,
                    createdAt: true
                }
            }
        }
    });
    return results.map((p: Permission) => {
        // Convert the main entity
        const converted = convertEntityId(p);

        // Convert rolePermissions IDs
        const convertedRolePermissions = p.rolePermissions?.map((rp: RolePermission) => ({
            ...rp,
            roleId: safeNumberId(rp.roleId),
            permissionId: safeNumberId(rp.permissionId),
            assignedBy: rp.assignedBy ? safeNumberId(rp.assignedBy) : null
        }));

        return {
            ...converted,
            rolePermissions: convertedRolePermissions
        };
    });
}

export async function getPermissionById(id: number): Promise<Permission | null> {
    const result = await prisma.permission.findUnique({
        where: { id: idParam(id) },
        include: {
            rolePermissions: {
                select: {
                    roleId: true,
                    permissionId: true,
                    assignedAt: true,
                    assignedBy: true,
                    createdAt: true
                }
            }
        }
    });
    if (!result) return null;

    // Convert the main entity
    const converted = convertEntityId(result);

    // Convert rolePermissions IDs
    const convertedRolePermissions = result.rolePermissions?.map((rp: RolePermission) => ({
        ...rp,
        roleId: safeNumberId(rp.roleId),
        permissionId: safeNumberId(rp.permissionId),
        assignedBy: rp.assignedBy ? safeNumberId(rp.assignedBy) : null
    }));

    return {
        ...converted,
        rolePermissions: convertedRolePermissions
    };
}

export async function getPermissionsByIds(ids: number[]): Promise<Permission[]> {
    const results = await prisma.permission.findMany({
        where: {
            id: { in: ids.map(id => idParam(id)) }
        },
        include: {
            rolePermissions: {
                select: {
                    roleId: true,
                    permissionId: true,
                    assignedAt: true,
                    assignedBy: true,
                    createdAt: true
                }
            }
        }
    });

    return results.map((p: Permission) => {
        // Convert the main entity
        const converted = convertEntityId(p);

        // Convert rolePermissions IDs
        const convertedRolePermissions = p.rolePermissions?.map((rp: RolePermission) => ({
            ...rp,
            roleId: safeNumberId(rp.roleId),
            permissionId: safeNumberId(rp.permissionId),
            assignedBy: rp.assignedBy ? safeNumberId(rp.assignedBy) : null
        }));

        return {
            ...converted,
            rolePermissions: convertedRolePermissions
        };
    });
}
