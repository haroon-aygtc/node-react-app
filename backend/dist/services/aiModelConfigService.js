import * as aiRepo from '../repositories/aiModelConfigRepository';
export async function createAIModelConfig(data) {
    if (!data.name.trim())
        throw new Error('Name is required');
    if (!data.provider.trim())
        throw new Error('Provider is required');
    if (!data.apiKey.trim())
        throw new Error('API key is required');
    return aiRepo.createAIModelConfig(data);
}
export async function getAllAIModelConfigs() {
    return aiRepo.getAllAIModelConfigs();
}
export async function getAIModelConfigById(id) {
    return aiRepo.getAIModelConfigById(id);
}
export async function updateAIModelConfig(id, data) {
    return aiRepo.updateAIModelConfig(id, data);
}
export async function deleteAIModelConfig(id) {
    return aiRepo.deleteAIModelConfig(id);
}
