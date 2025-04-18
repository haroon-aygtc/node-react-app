import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create default permissions
  const permissions = [
    // User management
    { name: 'user:create', description: 'Create users', action: 'create', category: 'user' },
    { name: 'user:read', description: 'View users', action: 'read', category: 'user' },
    { name: 'user:update', description: 'Update users', action: 'update', category: 'user' },
    { name: 'user:delete', description: 'Delete users', action: 'delete', category: 'user' },

    // Role management
    { name: 'role:create', description: 'Create roles', action: 'create', category: 'role' },
    { name: 'role:read', description: 'View roles', action: 'read', category: 'role' },
    { name: 'role:update', description: 'Update roles', action: 'update', category: 'role' },
    { name: 'role:delete', description: 'Delete roles', action: 'delete', category: 'role' },
    { name: 'role:assign', description: 'Assign roles to users', action: 'assign', category: 'role' },

    // Permission management
    { name: 'permission:assign', description: 'Assign permissions to roles', action: 'assign', category: 'permission' },
    { name: 'permission:read', description: 'View permissions', action: 'read', category: 'permission' },

    // AI Model management
    { name: 'aimodel:create', description: 'Create AI models', action: 'create', category: 'aimodel' },
    { name: 'aimodel:read', description: 'View AI models', action: 'read', category: 'aimodel' },
    { name: 'aimodel:update', description: 'Update AI models', action: 'update', category: 'aimodel' },
    { name: 'aimodel:delete', description: 'Delete AI models', action: 'delete', category: 'aimodel' },

    // Prompt management
    { name: 'prompt:create', description: 'Create prompts', action: 'create', category: 'prompt' },
    { name: 'prompt:read', description: 'View prompts', action: 'read', category: 'prompt' },
    { name: 'prompt:update', description: 'Update prompts', action: 'update', category: 'prompt' },
    { name: 'prompt:delete', description: 'Delete prompts', action: 'delete', category: 'prompt' },

    // Chat management
    { name: 'chat:create', description: 'Create chats', action: 'create', category: 'chat' },
    { name: 'chat:read', description: 'View chats', action: 'read', category: 'chat' },
    { name: 'chat:update', description: 'Update chats', action: 'update', category: 'chat' },
    { name: 'chat:delete', description: 'Delete chats', action: 'delete', category: 'chat' },

    // Settings management
    { name: 'settings:read', description: 'View settings', action: 'read', category: 'settings' },
    { name: 'settings:update', description: 'Update settings', action: 'update', category: 'settings' },
  ];

  console.log('Creating permissions...');
  for (const permission of permissions) {
    // First check if the permission already exists
    const existingPermission = await prisma.permission.findUnique({
      where: { name: permission.name },
    });

    if (!existingPermission) {
      // Only create if it doesn't exist
      await prisma.permission.create({
        data: {
          name: permission.name,
          description: permission.description,
          action: permission.action,
          category: permission.category
        },
      });
    } else {
      // Update if it exists
      await prisma.permission.update({
        where: { id: existingPermission.id },
        data: {
          description: permission.description,
          action: permission.action,
          category: permission.category
        },
      });
    }
  }

  // Create default roles
  const roles = [
    {
      name: 'admin',
      description: 'System administrator with full access',
      isDefault: false,
      permissions: ['*'], // All permissions
    },
    {
      name: 'manager',
      description: 'Manager with access to most features except system configuration',
      isDefault: false,
      permissions: [
        'user:read', 'user:create', 'user:update',
        'aimodel:read', 'aimodel:create', 'aimodel:update',
        'prompt:read', 'prompt:create', 'prompt:update', 'prompt:delete',
        'chat:read', 'chat:create', 'chat:update', 'chat:delete',
        'settings:read',
      ],
    },
    {
      name: 'user',
      description: 'Regular user with limited access',
      isDefault: true,
      permissions: [
        'chat:create', 'chat:read', 'chat:update',
        'aimodel:read',
        'prompt:read',
      ],
    },
    {
      name: 'guest',
      description: 'Guest user with minimal access',
      isDefault: false,
      permissions: [
        'chat:create', 'chat:read',
      ],
    },
  ];

  console.log('Creating roles...');
  for (const roleData of roles) {
    const { name, description, isDefault, permissions } = roleData;

    // First check if the role already exists
    const existingRole = await prisma.role.findUnique({
      where: { name },
    });

    let role;
    if (!existingRole) {
      // Create if it doesn't exist
      role = await prisma.role.create({
        data: { name, description, isDefault },
      });
    } else {
      // Update if it exists
      role = await prisma.role.update({
        where: { id: existingRole.id },
        data: { description, isDefault },
      });
    }

    // For admin role, assign all permissions
    if (name === 'admin') {
      const allPermissions = await prisma.permission.findMany();

      for (const permission of allPermissions) {
        // Check if the role-permission relationship already exists
        const existingRolePermission = await prisma.rolePermission.findFirst({
          where: {
            roleId: role.id,
            permissionId: permission.id,
          },
        });

        if (!existingRolePermission) {
          // Create new role-permission relationship if it doesn't exist
          await prisma.rolePermission.create({
            data: {
              roleId: role.id,
              permissionId: permission.id,
            },
          });
        }
      }
    } else {
      // For other roles, assign specific permissions
      for (const permName of permissions) {
        const permission = await prisma.permission.findUnique({
          where: { name: permName },
        });

        if (permission) {
          // Check if the role-permission relationship already exists
          const existingRolePermission = await prisma.rolePermission.findFirst({
            where: {
              roleId: role.id,
              permissionId: permission.id,
            },
          });

          if (!existingRolePermission) {
            // Create new role-permission relationship if it doesn't exist
            await prisma.rolePermission.create({
              data: {
                roleId: role.id,
                permissionId: permission.id,
              },
            });
          }
        }
      }
    }
  }

  // Create a default admin user if none exists
  const adminEmail = 'admin2@example.com';
  console.log(`Checking for existing admin user: ${adminEmail}`);
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    console.log('Creating default admin user...');
    const passwordHash = await bcrypt.hash('Admin@123', 10);
    console.log('Password hash created');

    const user = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        fullName: 'Admin',
        isActive: true,
        emailVerified: true,
      },
    });
    console.log(`Admin user created with ID: ${user.id}`);

    // Assign admin role to the user
    const adminRole = await prisma.role.findUnique({
      where: { name: 'admin' },
    });

    if (adminRole) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: adminRole.id,
        },
      });
      console.log(`Assigned admin role to user`);
    } else {
      console.error('Admin role not found - could not assign role to user');
    }
  } else {
    console.log('Admin user already exists, skipping creation');
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    throw e;
  })
  .finally(async () => {
    console.log('Disconnecting from database...');
    await prisma.$disconnect();
    console.log('Seed process complete.');
  });
