import prisma from '../config/prisma';
import type { Guest } from '../models/Guest';

export async function registerGuest(data: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>): Promise<Guest> {
  return prisma.guest.create({ data }) as unknown as Guest;
}

export async function getAllGuests(): Promise<Guest[]> {
  return prisma.guest.findMany() as unknown as Guest[];
}

export async function getGuestById(id: string): Promise<Guest | null> {
  return prisma.guest.findUnique({ where: { id } }) as unknown as Guest | null;
}
