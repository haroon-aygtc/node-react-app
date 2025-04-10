import prisma from '../config/prisma.js';
export async function getUserActivities(req, res) {
    try {
        const userId = req.query.userId || req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const [activities, total] = await Promise.all([
            prisma.userActivity.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.userActivity.count({ where: { userId } }),
        ]);
        res.json({
            data: activities,
            meta: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user activities' });
    }
}
export async function createUserActivity(req, res) {
    try {
        const { action, metadata } = req.body;
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];
        const activity = await prisma.userActivity.create({
            data: {
                userId: req.user.id,
                action,
                ipAddress: ipAddress,
                userAgent,
                metadata,
            },
        });
        res.status(201).json(activity);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create user activity' });
    }
}
