import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const getAllFollowUpConfigs = async (req, res) => {
    const configs = await prisma.followUpConfig.findMany();
    res.json(configs);
};
export const getFollowUpConfigById = async (req, res) => {
    const config = await prisma.followUpConfig.findUnique({
        where: { id: req.params.id },
        include: {
            predefinedQuestionSets: true,
            topicBasedQuestionSets: true,
        },
    });
    if (!config)
        return res.status(404).json({ error: 'Not found' });
    res.json(config);
};
export const createFollowUpConfig = async (req, res) => {
    const config = await prisma.followUpConfig.create({
        data: req.body,
    });
    res.status(201).json(config);
};
export const updateFollowUpConfig = async (req, res) => {
    const config = await prisma.followUpConfig.update({
        where: { id: req.params.id },
        data: req.body,
    });
    res.json(config);
};
export const deleteFollowUpConfig = async (req, res) => {
    await prisma.followUpConfig.delete({
        where: { id: req.params.id },
    });
    res.status(204).send();
};
// PredefinedQuestionSet CRUD
export const createPredefinedQuestionSet = async (req, res) => {
    const item = await prisma.predefinedQuestionSet.create({
        data: req.body,
    });
    res.status(201).json(item);
};
export const updatePredefinedQuestionSet = async (req, res) => {
    const item = await prisma.predefinedQuestionSet.update({
        where: { id: req.params.id },
        data: req.body,
    });
    res.json(item);
};
export const deletePredefinedQuestionSet = async (req, res) => {
    await prisma.predefinedQuestionSet.delete({
        where: { id: req.params.id },
    });
    res.status(204).send();
};
// TopicBasedQuestionSet CRUD
export const createTopicBasedQuestionSet = async (req, res) => {
    const item = await prisma.topicBasedQuestionSet.create({
        data: req.body,
    });
    res.status(201).json(item);
};
export const updateTopicBasedQuestionSet = async (req, res) => {
    const item = await prisma.topicBasedQuestionSet.update({
        where: { id: req.params.id },
        data: req.body,
    });
    res.json(item);
};
export const deleteTopicBasedQuestionSet = async (req, res) => {
    await prisma.topicBasedQuestionSet.delete({
        where: { id: req.params.id },
    });
    res.status(204).send();
};
