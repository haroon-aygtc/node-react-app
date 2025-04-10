import prisma from '../config/prisma';
import type { User } from '../models/User';

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

export async function getAllUsers(): Promise<User[]> {
  return prisma.user.findMany();
}

export async function createUser(data: Partial<User>): Promise<User> {
  return prisma.user.create({ data });
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  return prisma.user.update({ where: { id }, data });
}

export async function deleteUser(id: string): Promise<void> {
  await prisma.user.delete({ where: { id } });
}
