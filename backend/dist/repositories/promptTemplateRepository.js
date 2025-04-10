import prisma from '../config/prisma';
export async function createPromptTemplate(data) {
    return prisma.promptTemplate.create({ data });
}
export async function getAllPromptTemplates() {
    return prisma.promptTemplate.findMany();
}
export async function getPromptTemplateById(id) {
    return prisma.promptTemplate.findUnique({ where: { id } });
}
export async function updatePromptTemplate(id, data) {
    return prisma.promptTemplate.update({ where: { id }, data });
}
export async function deletePromptTemplate(id) {
    await prisma.promptTemplate.delete({ where: { id } });
}
