import * as guestService from '../services/guestService';
export async function registerGuest(req, res) {
    try {
        const guest = await guestService.registerGuest(req.body);
        res.status(201).json(guest);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
export async function getAllGuests(req, res) {
    try {
        const guests = await guestService.getAllGuests();
        res.json(guests);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch guests' });
    }
}
export async function getGuestById(req, res) {
    try {
        const guest = await guestService.getGuestById(req.params.id);
        if (!guest)
            return res.status(404).json({ error: 'Guest not found' });
        res.json(guest);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch guest' });
    }
}
