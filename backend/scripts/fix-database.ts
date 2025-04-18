import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Running database fix script...');

    // Test database connection
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('Database connection successful');

    // Run prisma db push to ensure schema is up-to-date
    console.log('Running prisma db push...');
    await execAsync('npx prisma db push --accept-data-loss');
    console.log('Schema push completed');

    // Run database seed
    console.log('Running database seed...');
    await execAsync('npx prisma db seed');
    console.log('Database seed completed');

    console.log('Database fix script completed successfully');
  } catch (error) {
    console.error('Error running database fix script:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
