import * as promptService from '../services/promptTemplateService';
export async function createPromptTemplate(req, res) {
    try {
        const template = await promptService.createPromptTemplate(req.body);
        res.status(201).json(template);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
export async function getAllPromptTemplates(req, res) {
    try {
        const templates = await promptService.getAllPromptTemplates();
        res.json(templates);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch prompt templates' });
    }
}
export async function getPromptTemplateById(req, res) {
    try {
        const template = await promptService.getPromptTemplateById(req.params.id);
        if (!template)
            return res.status(404).json({ error: 'Prompt template not found' });
        res.json(template);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch prompt template' });
    }
}
export async function updatePromptTemplate(req, res) {
    try {
        const template = await promptService.updatePromptTemplate(req.params.id, req.body);
        res.json(template);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
export async function deletePromptTemplate(req, res) {
    try {
        await promptService.deletePromptTemplate(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete prompt template' });
    }
}
