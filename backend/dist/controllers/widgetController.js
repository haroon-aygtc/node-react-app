import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const getAllWidgets = async (req, res) => {
    const widgets = await prisma.widgetConfig.findMany();
    res.json(widgets);
};
export const getWidgetById = async (req, res) => {
    const widget = await prisma.widgetConfig.findUnique({
        where: { id: req.params.id },
    });
    if (!widget)
        return res.status(404).json({ error: 'Not found' });
    res.json(widget);
};
export const createWidget = async (req, res) => {
    const widget = await prisma.widgetConfig.create({
        data: req.body,
    });
    res.status(201).json(widget);
};
export const updateWidget = async (req, res) => {
    const widget = await prisma.widgetConfig.update({
        where: { id: req.params.id },
        data: req.body,
    });
    res.json(widget);
};
export const deleteWidget = async (req, res) => {
    await prisma.widgetConfig.delete({
        where: { id: req.params.id },
    });
    res.status(204).send();
};
