import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
export async function registerUser(data) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing)
        throw new Error('Email already registered');
    const passwordHash = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
        data: {
            email: data.email,
            passwordHash,
            fullName: data.fullName,
        },
    });
}
export async function loginUser(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
        throw new Error('Invalid credentials');
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return { user, token };
}
export async function getUserById(id) {
    return prisma.user.findUnique({ where: { id } });
}
