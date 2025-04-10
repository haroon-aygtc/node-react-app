import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// ScrapingJob CRUD
export const getAllScrapingJobs = async (req, res) => {
    const jobs = await prisma.scrapingJob.findMany();
    res.json(jobs);
};
export const getScrapingJobById = async (req, res) => {
    const job = await prisma.scrapingJob.findUnique({
        where: { id: req.params.id },
    });
    if (!job)
        return res.status(404).json({ error: 'Not found' });
    res.json(job);
};
export const createScrapingJob = async (req, res) => {
    const job = await prisma.scrapingJob.create({
        data: req.body,
    });
    res.status(201).json(job);
};
export const updateScrapingJob = async (req, res) => {
    const job = await prisma.scrapingJob.update({
        where: { id: req.params.id },
        data: req.body,
    });
    res.json(job);
};
export const deleteScrapingJob = async (req, res) => {
    await prisma.scrapingJob.delete({
        where: { id: req.params.id },
    });
    res.status(204).send();
};
// ScrapingSelector CRUD
export const getAllScrapingSelectors = async (req, res) => {
    const selectors = await prisma.scrapingSelector.findMany();
    res.json(selectors);
};
export const getScrapingSelectorById = async (req, res) => {
    const selector = await prisma.scrapingSelector.findUnique({
        where: { id: req.params.id },
    });
    if (!selector)
        return res.status(404).json({ error: 'Not found' });
    res.json(selector);
};
export const createScrapingSelector = async (req, res) => {
    const selector = await prisma.scrapingSelector.create({
        data: req.body,
    });
    res.status(201).json(selector);
};
export const updateScrapingSelector = async (req, res) => {
    const selector = await prisma.scrapingSelector.update({
        where: { id: req.params.id },
        data: req.body,
    });
    res.json(selector);
};
export const deleteScrapingSelector = async (req, res) => {
    await prisma.scrapingSelector.delete({
        where: { id: req.params.id },
    });
    res.status(204).send();
};
// ScrapingData CRUD
export const getAllScrapingData = async (req, res) => {
    const data = await prisma.scrapingData.findMany();
    res.json(data);
};
export const getScrapingDataById = async (req, res) => {
    const data = await prisma.scrapingData.findUnique({
        where: { id: req.params.id },
    });
    if (!data)
        return res.status(404).json({ error: 'Not found' });
    res.json(data);
};
export const createScrapingData = async (req, res) => {
    const data = await prisma.scrapingData.create({
        data: req.body,
    });
    res.status(201).json(data);
};
export const updateScrapingData = async (req, res) => {
    const data = await prisma.scrapingData.update({
        where: { id: req.params.id },
        data: req.body,
    });
    res.json(data);
};
export const deleteScrapingData = async (req, res) => {
    await prisma.scrapingData.delete({
        where: { id: req.params.id },
    });
    res.status(204).send();
};
