/**
 * Script to set up the database
 * 
 * This script:
 * 1. Checks the database connection
 * 2. Creates the database schema if it doesn't exist
 * 3. Creates default roles and permissions
 */

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

// Get directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function main() {
  try {
    console.log('Starting database setup...');

    // Check if .env file exists, if not copy from .env.development
    const envPath = path.join(rootDir, '.env');
    const envDevPath = path.join(rootDir, '.env.development');

    if (!fs.existsSync(envPath) && fs.existsSync(envDevPath)) {
      console.log('Creating .env file from .env.development...');
      fs.copyFileSync(envDevPath, envPath);
    }

    // Test database connection
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('Database connection successful');

    // Run prisma db push to ensure schema is up-to-date
    console.log('Running prisma db push...');
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', cwd: rootDir });
    console.log('Schema push completed');

    // Check if roles exist
    const roleCount = await prisma.role.count();
    console.log(`Found ${roleCount} roles in the database`);

    if (roleCount === 0) {
      console.log('Creating default roles...');
      
      // Create admin role
      await prisma.role.create({
        data: {
          name: 'admin',
          description: 'System administrator with full access',
          isDefault: false,
          isSystem: true
        }
      });
      console.log('Admin role created');
      
      // Create user role
      await prisma.role.create({
        data: {
          name: 'user',
          description: 'Regular user with limited access',
          isDefault: true,
          isSystem: true
        }
      });
      console.log('User role created');
    }

    // Check if permissions exist
    const permissionCount = await prisma.permission.count();
    console.log(`Found ${permissionCount} permissions in the database`);

    if (permissionCount === 0) {
      console.log('Creating default permissions...');
      
      // Create basic permissions
      const permissions = [
        { name: 'user:read', description: 'View users', category: 'user', action: 'read' },
        { name: 'user:create', description: 'Create users', category: 'user', action: 'create' },
        { name: 'user:update', description: 'Update users', category: 'user', action: 'update' },
        { name: 'user:delete', description: 'Delete users', category: 'user', action: 'delete' },
        { name: 'role:read', description: 'View roles', category: 'role', action: 'read' },
        { name: 'role:create', description: 'Create roles', category: 'role', action: 'create' },
        { name: 'role:update', description: 'Update roles', category: 'role', action: 'update' },
        { name: 'role:delete', description: 'Delete roles', category: 'role', action: 'delete' },
        { name: 'role:assign', description: 'Assign roles', category: 'role', action: 'assign' },
        { name: 'permission:read', description: 'View permissions', category: 'permission', action: 'read' },
        { name: 'permission:assign', description: 'Assign permissions', category: 'permission', action: 'assign' }
      ];
      
      for (const permission of permissions) {
        await prisma.permission.create({ data: permission });
      }
      
      console.log(`Created ${permissions.length} permissions`);
    }

    // Assign permissions to admin role
    const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
    if (adminRole) {
      const permissions = await prisma.permission.findMany();
      
      for (const permission of permissions) {
        // Check if the permission is already assigned
        const existing = await prisma.rolePermission.findFirst({
          where: {
            roleId: adminRole.id,
            permissionId: permission.id
          }
        });
        
        if (!existing) {
          await prisma.rolePermission.create({
            data: {
              roleId: adminRole.id,
              permissionId: permission.id,
              assignedAt: new Date()
            }
          });
        }
      }
      
      console.log(`Assigned all permissions to admin role`);
    }

    // Create a default admin user if none exists
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in the database`);

    if (userCount === 0) {
      console.log('Creating default admin user...');
      
      // Create admin user
      const adminUser = await prisma.user.create({
        data: {
          email: 'admin@example.com',
          passwordHash: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm', // password: secret
          fullName: 'Admin User',
          isActive: true,
          emailVerified: true
        }
      });
      
      // Assign admin role to user
      if (adminRole) {
        await prisma.userRole.create({
          data: {
            userId: adminUser.id,
            roleId: adminRole.id,
            assignedAt: new Date()
          }
        });
      }
      
      console.log(`Created admin user with email: admin@example.com and password: secret`);
    }

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
