import prisma from '../config/prisma.js';
import type { Role, UserRole, RolePermission, Permission } from '../models/index.js';
import { convertEntityId, convertEntityIds, idParam, safeNumberId } from '../utils/typeConverters.js';

export async function getAllPermissions(): Promise<Permission[]> {
    const permissions = await prisma.permission.findMany({
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
    return permissions.map((p) => {
        // Convert the main entity
        const converted = convertEntityId(p);

        // Convert rolePermissions IDs
        const convertedRolePermissions = p.rolePermissions?.map(rp => ({
            ...rp,
            roleId: safeNumberId(rp.roleId),
            permissionId: safeNumberId(rp.permissionId),
            assignedBy: rp.assignedBy ? safeNumberId(rp.assignedBy) : null
        })) || [];

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
    const convertedRolePermissions = result.rolePermissions.map((rp: RolePermission) => ({
        ...rp,
        roleId: safeNumberId(rp.roleId),
        permissionId: safeNumberId(rp.permissionId),
        assignedBy: rp.assignedBy ? safeNumberId(rp.assignedBy) : null
    })) || [];

    return {
        ...converted,
        rolePermissions: convertedRolePermissions
    };
}

export async function getPermissionsByIds(ids: number[]): Promise<Permission[]> {
    const permissions = await prisma.permission.findMany({
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

    return permissions.map((p: Permission) => {
        // Convert the main entity
        const converted = convertEntityId(p);

        // Convert rolePermissions IDs
        const convertedRolePermissions = p.rolePermissions?.map((rp: RolePermission) => ({
            ...rp,
            roleId: safeNumberId(rp.roleId),
            permissionId: safeNumberId(rp.permissionId),
            assignedBy: rp.assignedBy ? safeNumberId(rp.assignedBy) : null
        })) || [];

        return {
            ...converted,
            rolePermissions: convertedRolePermissions
        };
    });
}

export async function getRoleById(id: number): Promise<Role | null> {
    const result = await prisma.role.findUnique({
        where: { id: idParam(id) },
        include: {
            rolePermissions: {
                include: {
                    permission: true
                }
            }
        }
    });

    if (!result) return null;

    // Convert string IDs to numbers
    const converted = convertEntityId(result);

    // Convert nested IDs
    return {
        ...converted,
        rolePermissions: result.rolePermissions.map(rp => ({
            ...rp,
            roleId: safeNumberId(rp.roleId),
            permissionId: safeNumberId(rp.permissionId),
            assignedBy: rp.assignedBy ? safeNumberId(rp.assignedBy) : null,
            permission: rp.permission ? convertEntityId(rp.permission) : undefined
        }))
    } as Role;
}

export async function getAllRoles(): Promise<Role[]> {
    const results = await prisma.role.findMany({
        include: {
            rolePermissions: {
                include: {
                    permission: true
                }
            }
        }
    });
    return results.map(r => {
        // Convert the main entity
        const converted = convertEntityId(r);

        // Convert nested rolePermissions
        return {
            ...converted,
            rolePermissions: r.rolePermissions.map(rp => ({
                ...rp,
                roleId: safeNumberId(rp.roleId),
                permissionId: safeNumberId(rp.permissionId),
                assignedBy: rp.assignedBy ? safeNumberId(rp.assignedBy) : null,
                permission: rp.permission ? convertEntityId(rp.permission) : undefined
            }))
        };
    });
}

export async function createRole(data: Partial<Role>): Promise<Role> {
    const result = await prisma.role.create({
        data: {
            name: data.name!,
            description: data.description || '',
            isDefault: data.isDefault ?? false,
            isSystem: data.isSystem ?? false
        },
        include: {
            rolePermissions: {
                include: {
                    permission: true
                }
            }
        }
    });

    // Convert the main entity
    const converted = convertEntityId(result);

    // Convert nested rolePermissions
    return {
        ...converted,
        rolePermissions: result.rolePermissions.map(rp => ({
            ...rp,
            roleId: safeNumberId(rp.roleId),
            permissionId: safeNumberId(rp.permissionId),
            assignedBy: rp.assignedBy ? safeNumberId(rp.assignedBy) : null,
            permission: rp.permission ? convertEntityId(rp.permission) : undefined
        }))
    };
}

export async function updateRole(id: number, data: Partial<Role>): Promise<Role> {
    const updateData: any = { ...data };

    // Remove properties that Prisma can't directly update
    delete updateData.rolePermissions;
    delete updateData.id;

    const result = await prisma.role.update({
        where: { id: idParam(id) },
        data: {
            ...updateData,
            updatedAt: new Date()
        },
        include: {
            rolePermissions: {
                include: {
                    permission: true
                }
            }
        }
    });

    // Convert the main entity
    const converted = convertEntityId(result);

    // Convert nested rolePermissions
    return {
        ...converted,
        rolePermissions: result.rolePermissions.map(rp => ({
            ...rp,
            roleId: safeNumberId(rp.roleId),
            permissionId: safeNumberId(rp.permissionId),
            assignedBy: rp.assignedBy ? safeNumberId(rp.assignedBy) : null,
            permission: rp.permission ? convertEntityId(rp.permission) : undefined
        }))
    };
}

export async function deleteRole(id: number): Promise<void> {
    await prisma.role.delete({ where: { id: idParam(id) } });
}

export async function assignPermissionToRole(roleId: number, permissionId: number) {
    return prisma.rolePermission.create({
        data: {
            roleId: idParam(roleId),
            permissionId: idParam(permissionId)
        }
    });
}

export async function removePermissionFromRole(roleId: number, permissionId: number) {
    // Use composite ID format
    await prisma.$executeRaw`DELETE FROM RolePermission WHERE roleId = ${idParam(roleId)} AND permissionId = ${idParam(permissionId)}`;
}

export async function getRoleByName(name: string): Promise<Role | null> {
    try {
        console.log(`Looking for role with name: ${name}`);
        const role = await prisma.role.findUnique({ where: { name } });
        console.log(`Role ${name} found:`, !!role);
        if (!role) return null;

        return convertEntityId(role);
    } catch (error) {
        console.error(`Error finding role by name '${name}':`, error);
        return null;
    }
}

export async function getRolePermissions(roleId: number): Promise<RolePermission[]> {
    const rolePermissions = await prisma.rolePermission.findMany({
        where: { roleId: idParam(roleId) },
        include: {
            permission: true
        }
    });

    return rolePermissions.map(rp => {
        const converted = convertEntityId(rp);
        return {
            ...converted,
            roleId: safeNumberId(rp.roleId),
            permissionId: safeNumberId(rp.permissionId),
            assignedBy: rp.assignedBy ? safeNumberId(rp.assignedBy) : null,
            permission: rp.permission ? convertEntityId(rp.permission) : undefined
        };
    });
}

export async function getUsersByRoleId(roleId: number): Promise<UserRole[]> {
    const userRoles = await prisma.userRole.findMany({
        where: { roleId: idParam(roleId) },
        include: {
            user: true
        }
    });

    return userRoles.map(ur => {
        const converted = convertEntityId(ur);
        return {
            userId: safeNumberId(ur.userId),
            roleId: safeNumberId(ur.roleId),
            assignedAt: ur.assignedAt,
            assignedBy: ur.assignedBy ? safeNumberId(ur.assignedBy) : null,
            createdAt: ur.createdAt
        };
    });
}

export async function assignRoleToUser(userId: number, roleId: number): Promise<UserRole> {
    try {
        console.log(`Assigning role ${roleId} to user ${userId}`);

        // Ensure userId and roleId are valid
        if (!userId || !roleId) {
            throw new Error(`Invalid userId (${userId}) or roleId (${roleId})`);
        }

        // Convert to the right type if needed
        const userIdNum = typeof userId === 'string' ? parseInt(userId, 10) : userId;
        const roleIdNum = typeof roleId === 'string' ? parseInt(roleId, 10) : roleId;

        // Check if relationship already exists
        console.log(`Checking if relationship already exists`);
        try {
            const existing = await prisma.$queryRaw`
                SELECT * FROM UserRole WHERE userId = ${userIdNum} AND roleId = ${roleIdNum} LIMIT 1
            `;
            console.log(`Relationship exists:`, (existing as any[]).length > 0);

            if ((existing as any[]).length > 0) {
                // Update existing relationship
                console.log(`Updating existing relationship`);
                await prisma.$executeRaw`
                    UPDATE UserRole SET assignedAt = NOW() WHERE userId = ${userIdNum} AND roleId = ${roleIdNum}
                `;
                console.log(`Relationship updated successfully`);

                return {
                    userId: userIdNum,
                    roleId: roleIdNum,
                    assignedAt: new Date(),
                    assignedBy: null,
                    createdAt: new Date()
                };
            }
        } catch (queryError) {
            console.error(`Error checking existing relationship:`, queryError);
            // Continue to create new relationship
        }

        // Create new relationship
        console.log(`Creating new relationship`);
        console.log(`userId: ${userIdNum} (${typeof userIdNum}), roleId: ${roleIdNum} (${typeof roleIdNum})`);

        try {
            const result = await prisma.userRole.create({
                data: {
                    userId: userIdNum,
                    roleId: roleIdNum,
                    assignedAt: new Date()
                }
            });
            console.log(`Relationship created successfully with ID: ${result.id}`);

            // Convert string IDs to numbers
            return {
                ...convertEntityId(result),
                userId: safeNumberId(result.userId),
                roleId: safeNumberId(result.roleId),
                assignedBy: result.assignedBy ? safeNumberId(result.assignedBy) : null
            };
        } catch (createError) {
            console.error(`Error creating user role relationship:`, createError);
            throw createError; // Re-throw to be handled by the caller
        }
    } catch (error) {
        console.error(`Error assigning role ${roleId} to user ${userId}:`, error);
        // Re-throw the error to be handled by the caller
        throw error;
    }
}

export async function removeRoleFromUser(userId: number, roleId: number): Promise<void> {
    await prisma.$executeRaw`DELETE FROM UserRole WHERE userId = ${idParam(userId)} AND roleId = ${idParam(roleId)}`;
}

export async function replaceUserRoles(userId: number, roleIds: number[]): Promise<number> {
    // Delete existing roles
    await prisma.userRole.deleteMany({
        where: { userId: idParam(userId) }
    });

    // Add new roles
    const result = await prisma.$transaction(
        roleIds.map(roleId =>
            prisma.userRole.create({
                data: {
                    userId: idParam(userId),
                    roleId: idParam(roleId),
                    assignedAt: new Date()
                }
            })
        )
    );

    return result.length;
}

export async function createRolePermission(roleId: number, permissionId: number): Promise<RolePermission> {
    const result = await prisma.rolePermission.create({
        data: {
            roleId: idParam(roleId),
            permissionId: idParam(permissionId)
        }
    });

    return {
        ...convertEntityId(result),
        roleId: safeNumberId(result.roleId),
        permissionId: safeNumberId(result.permissionId),
        assignedBy: result.assignedBy ? safeNumberId(result.assignedBy) : null
    };
}

export async function deleteRolePermission(roleId: number, permissionId: number): Promise<void> {
    await prisma.$executeRaw`DELETE FROM RolePermission WHERE roleId = ${idParam(roleId)} AND permissionId = ${idParam(permissionId)}`;
}

export async function getUserRole(userId: number, roleId: number): Promise<UserRole | null> {
    const result = await prisma.$queryRaw`
        SELECT * FROM UserRole WHERE userId = ${userId} AND roleId = ${roleId} LIMIT 1
    `;

    if ((result as any[]).length === 0) {
        return null;
    }

    const userRole = (result as any[])[0];
    return {
        ...convertEntityId(userRole),
        userId: safeNumberId(userRole.userId),
        roleId: safeNumberId(userRole.roleId),
        assignedBy: userRole.assignedBy ? safeNumberId(userRole.assignedBy) : null
    };
}

export async function deleteRolePermissions(roleId: number): Promise<void> {
    await prisma.$executeRaw`DELETE FROM RolePermission WHERE roleId = ${idParam(roleId)}`;
}

export async function getUserById(id: number): Promise<any | null> {
    const user = await prisma.user.findUnique({ where: { id: idParam(id) } });
    return user ? convertEntityId(user) : null;
}
