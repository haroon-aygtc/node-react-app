import * as promptRepo from '../repositories/promptTemplateRepository';
export async function createPromptTemplate(data) {
    if (!data.name.trim())
        throw new Error('Name is required');
    if (!data.templateText.trim())
        throw new Error('Template text is required');
    return promptRepo.createPromptTemplate(data);
}
export async function getAllPromptTemplates() {
    return promptRepo.getAllPromptTemplates();
}
export async function getPromptTemplateById(id) {
    return promptRepo.getPromptTemplateById(id);
}
export async function updatePromptTemplate(id, data) {
    return promptRepo.updatePromptTemplate(id, data);
}
export async function deletePromptTemplate(id) {
    return promptRepo.deletePromptTemplate(id);
}
