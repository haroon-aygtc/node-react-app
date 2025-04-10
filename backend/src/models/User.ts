import type { User as PrismaUser } from '@prisma/client';

export interface User extends PrismaUser {
  // Extend with domain-specific properties or methods if needed
}
