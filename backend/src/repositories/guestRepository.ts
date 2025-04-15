import prisma from '../config/prisma.js';
import type { Guest } from '../models/index.js';

export async function registerGuest(data: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>): Promise<Guest> {
  // Since Guest is a custom type not directly mapped to a Prisma model,
  // we need to handle it differently
  const result = await prisma.$queryRaw`
    INSERT INTO Guest (fullName, email, phone)
    VALUES (${data.fullName}, ${data.email}, ${data.phone || null})
    RETURNING *
  `;
  return result[0] as Guest;
}

export async function getAllGuests(): Promise<Guest[]> {
  // Using raw query since Guest is a custom type
  const result = await prisma.$queryRaw`SELECT * FROM Guest`;
  return result as Guest[];
}

export async function getGuestById(id: string): Promise<Guest | null> {
  // Using raw query since Guest is a custom type
  const result = await prisma.$queryRaw`SELECT * FROM Guest WHERE id = ${id}`;
  return result.length ? (result[0] as Guest) : null;
}
