/**
 * Script to check Prisma database connection
 */

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking Prisma database connection...');
    console.log('Database URL:', process.env.DB_URL || process.env.DATABASE_URL);

    // Try to connect to the database
    await prisma.$connect();
    console.log('Prisma database connection successful!');

    // Try to query the database
    try {
      const userCount = await prisma.user.count();
      console.log(`Number of users in database: ${userCount}`);
    } catch (error) {
      console.error('Error querying users table:', error);
      console.log('This might indicate that migrations have not been applied.');
    }

    console.log('Prisma check complete!');
  } catch (error) {
    console.error('Prisma database connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
