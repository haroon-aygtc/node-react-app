import prisma from '../config/prisma';
export async function getAllUsers(req, res) {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}
export async function getUserById(req, res) {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.params.id } });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
}
export async function updateUser(req, res) {
    try {
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
export async function deleteUser(req, res) {
    try {
        await prisma.user.delete({ where: { id: req.params.id } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
}
