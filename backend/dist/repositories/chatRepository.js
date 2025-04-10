import prisma from '../config/prisma';
export async function createSession(data) {
    return prisma.chatSession.create({ data });
}
export async function getSessionById(id) {
    return prisma.chatSession.findUnique({ where: { id } });
}
export async function getUserSessions(userId) {
    return prisma.chatSession.findMany({ where: { userId } });
}
export async function createMessage(data) {
    return prisma.chatMessage.create({ data });
}
export async function getMessagesBySession(sessionId) {
    return prisma.chatMessage.findMany({ where: { sessionId } });
}
