import { Request, Response } from 'express';
import * as guestService from '../services/guestService';

export async function registerGuest(req: Request, res: Response) {
  try {
    const guest = await guestService.registerGuest(req.body);
    res.status(201).json(guest);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function getAllGuests(req: Request, res: Response) {
  try {
    const guests = await guestService.getAllGuests();
    res.json(guests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch guests' });
  }
}

export async function getGuestById(req: Request, res: Response) {
  try {
    const guest = await guestService.getGuestById(req.params.id);
    if (!guest) return res.status(404).json({ error: 'Guest not found' });
    res.json(guest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch guest' });
  }
}
