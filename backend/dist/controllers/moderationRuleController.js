import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const getAllModerationRules = async (req, res) => {
    const rules = await prisma.moderationRule.findMany();
    res.json(rules);
};
export const getModerationRuleById = async (req, res) => {
    const rule = await prisma.moderationRule.findUnique({
        where: { id: req.params.id },
    });
    if (!rule)
        return res.status(404).json({ error: 'Not found' });
    res.json(rule);
};
export const createModerationRule = async (req, res) => {
    const rule = await prisma.moderationRule.create({
        data: req.body,
    });
    res.status(201).json(rule);
};
export const updateModerationRule = async (req, res) => {
    const rule = await prisma.moderationRule.update({
        where: { id: req.params.id },
        data: req.body,
    });
    res.json(rule);
};
export const deleteModerationRule = async (req, res) => {
    await prisma.moderationRule.delete({
        where: { id: req.params.id },
    });
    res.status(204).send();
};
