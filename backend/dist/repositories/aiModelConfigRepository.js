import prisma from '../config/prisma';
export async function createAIModelConfig(data) {
    return prisma.apiKey.create({ data });
}
export async function getAllAIModelConfigs() {
    return prisma.apiKey.findMany();
}
export async function getAIModelConfigById(id) {
    return prisma.apiKey.findUnique({ where: { id } });
}
export async function updateAIModelConfig(id, data) {
    return prisma.apiKey.update({ where: { id }, data });
}
export async function deleteAIModelConfig(id) {
    await prisma.apiKey.delete({ where: { id } });
}
