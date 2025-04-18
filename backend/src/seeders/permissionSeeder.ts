import prisma from '../config/prisma.js';
import { logger } from '../utils/logger.js';

/**
 * Seed default permissions
 */
export async function seedPermissions() {
  logger.info('Seeding permissions...');

  // Define permission categories
  const categories = [
    'user',
    'role',
    'permission',
    'content',
    'settings',
    'analytics',
    'scraping'
  ];

  // Define permission actions
  const actions = [
    'create',
    'read',
    'update',
    'delete',
    'assign',
    'export'
  ];

  // Create permissions for each category and action
  const permissions = [];
  for (const category of categories) {
    for (const action of actions) {
      // Skip some combinations that don't make sense
      if (
        (category === 'permission' && action === 'create') ||
        (category === 'permission' && action === 'delete') ||
        (category === 'analytics' && action === 'create') ||
        (category === 'analytics' && action === 'update') ||
        (category === 'analytics' && action === 'delete')
      ) {
        continue;
      }

      permissions.push({
        name: `${category}:${action}`,
        description: `Can ${action} ${category}s`,
        category,
        action
      });
    }
  }

  // Add special permissions
  permissions.push({
    name: 'admin:access',
    description: 'Can access admin panel',
    category: 'admin',
    action: 'access'
  });

  // Create permissions in database
  let created = 0;
  let skipped = 0;

  for (const permission of permissions) {
    try {
      // Check if permission already exists
      const existing = await prisma.permission.findUnique({
        where: { name: permission.name }
      });

      if (!existing) {
        await prisma.permission.create({
          data: permission
        });
        created++;
      } else {
        skipped++;
      }
    } catch (error) {
      logger.error(`Error creating permission ${permission.name}:`, error);
    }
  }

  logger.info(`Permissions seeded: ${created} created, ${skipped} skipped`);
}

/**
 * Seed default roles with permissions
 */
export async function seedRoles() {
  logger.info('Seeding roles...');

  // Define roles
  const roles = [
    {
      name: 'admin',
      description: 'Administrator with full access',
      isDefault: false,
      isSystem: true,
      permissions: ['admin:access'] // Will add all permissions later
    },
    {
      name: 'user',
      description: 'Regular user with limited access',
      isDefault: true,
      isSystem: true,
      permissions: [
        'content:read',
        'analytics:read',
        'scraping:read',
        'scraping:create'
      ]
    },
    {
      name: 'editor',
      description: 'Editor with content management access',
      isDefault: false,
      isSystem: true,
      permissions: [
        'content:read',
        'content:create',
        'content:update',
        'analytics:read',
        'scraping:read',
        'scraping:create',
        'scraping:update'
      ]
    },
    {
      name: 'manager',
      description: 'Manager with user management access',
      isDefault: false,
      isSystem: true,
      permissions: [
        'user:read',
        'user:create',
        'user:update',
        'role:read',
        'content:read',
        'content:create',
        'content:update',
        'analytics:read',
        'scraping:read',
        'scraping:create',
        'scraping:update'
      ]
    }
  ];

  // Get all permissions for admin role
  const allPermissions = await prisma.permission.findMany();
  const allPermissionNames = allPermissions.map(p => p.name);

  // Create roles in database
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const role of roles) {
    try {
      // Check if role already exists
      const existing = await prisma.role.findUnique({
        where: { name: role.name }
      });

      // For admin role, assign all permissions
      const permissionNames = role.name === 'admin' ? allPermissionNames : role.permissions;

      if (!existing) {
        // Create new role
        const newRole = await prisma.role.create({
          data: {
            name: role.name,
            description: role.description,
            isDefault: role.isDefault,
            isSystem: role.isSystem
          }
        });

        // Assign permissions to role
        const permissions = await prisma.permission.findMany({
          where: { name: { in: permissionNames } }
        });

        for (const permission of permissions) {
          await prisma.rolePermission.create({
            data: {
              roleId: newRole.id,
              permissionId: permission.id
            }
          });
        }

        created++;
      } else {
        // Update existing role
        await prisma.role.update({
          where: { id: existing.id },
          data: {
            description: role.description,
            isDefault: role.isDefault,
            isSystem: role.isSystem
          }
        });

        // Get current permissions
        const currentPermissions = await prisma.rolePermission.findMany({
          where: { roleId: existing.id },
          include: { permission: true }
        });

        const currentPermissionNames = currentPermissions.map(rp => rp.permission.name);

        // Find permissions to add
        const permissionsToAdd = permissionNames.filter(name => !currentPermissionNames.includes(name));
        
        if (permissionsToAdd.length > 0) {
          const permissionsToAddObjects = await prisma.permission.findMany({
            where: { name: { in: permissionsToAdd } }
          });

          for (const permission of permissionsToAddObjects) {
            await prisma.rolePermission.create({
              data: {
                roleId: existing.id,
                permissionId: permission.id
              }
            });
          }
        }

        updated++;
      }
    } catch (error) {
      logger.error(`Error creating/updating role ${role.name}:`, error);
      skipped++;
    }
  }

  logger.info(`Roles seeded: ${created} created, ${updated} updated, ${skipped} skipped`);
}

/**
 * Run all seeders
 */
export async function runSeeders() {
  try {
    await seedPermissions();
    await seedRoles();
    logger.info('All seeders completed successfully');
  } catch (error) {
    logger.error('Error running seeders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run seeders if this file is executed directly
if (process.argv[1] === __filename) {
  runSeeders()
    .then(() => process.exit(0))
    .catch(error => {
      logger.error('Error running seeders:', error);
      process.exit(1);
    });
}
