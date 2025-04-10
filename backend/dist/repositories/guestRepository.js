import prisma from '../config/prisma';
export async function registerGuest(data) {
    return prisma.guest.create({ data });
}
export async function getAllGuests() {
    return prisma.guest.findMany();
}
export async function getGuestById(id) {
    return prisma.guest.findUnique({ where: { id } });
}
