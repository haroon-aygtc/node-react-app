import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const getAllMonitoringLogs = async (req, res) => {
    const logs = await prisma.monitoringLog.findMany();
    res.json(logs);
};
export const getMonitoringLogById = async (req, res) => {
    const log = await prisma.monitoringLog.findUnique({
        where: { id: req.params.id },
    });
    if (!log)
        return res.status(404).json({ error: 'Not found' });
    res.json(log);
};
export const createMonitoringLog = async (req, res) => {
    const log = await prisma.monitoringLog.create({
        data: req.body,
    });
    res.status(201).json(log);
};
export const updateMonitoringLog = async (req, res) => {
    const log = await prisma.monitoringLog.update({
        where: { id: req.params.id },
        data: req.body,
    });
    res.json(log);
};
export const deleteMonitoringLog = async (req, res) => {
    await prisma.monitoringLog.delete({
        where: { id: req.params.id },
    });
    res.status(204).send();
};
