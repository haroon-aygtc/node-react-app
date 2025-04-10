import * as authService from '../services/authService';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
export async function register(req, res) {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
export async function login(req, res) {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.loginUser(email, password);
        res.json({ user, token });
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
}
export async function getMe(req, res) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: 'Missing token' });
        const token = authHeader.replace('Bearer ', '');
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await authService.getUserById(payload.userId);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json(user);
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}
