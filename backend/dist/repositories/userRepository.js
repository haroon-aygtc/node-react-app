import prisma from '../config/prisma';
export async function getUserById(id) {
    return prisma.user.findUnique({ where: { id } });
}
export async function getAllUsers() {
    return prisma.user.findMany();
}
export async function createUser(data) {
    return prisma.user.create({ data });
}
export async function updateUser(id, data) {
    return prisma.user.update({ where: { id }, data });
}
export async function deleteUser(id) {
    await prisma.user.delete({ where: { id } });
}
