import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import type { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function registerUser(data: {
  email: string;
  password: string;
  fullName?: string;
}): Promise<User> {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error('Email already registered');

  const passwordHash = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      fullName: data.fullName,
    },
  });
}

export async function loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error('Invalid credentials');

  const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

  return { user, token };
}

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}
