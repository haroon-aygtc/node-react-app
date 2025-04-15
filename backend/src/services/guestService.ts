import * as guestRepo from '../repositories/guestRepository.js';
import type { Guest } from '../models/index.js';

export async function registerGuest(data: {
  fullName: string;
  email: string;
  phone?: string;
}): Promise<Guest> {
  if (!data.fullName.trim()) throw new Error('Full name is required');
  if (!data.email.trim()) throw new Error('Email is required');

  return guestRepo.registerGuest(data);
}

export async function getAllGuests(): Promise<Guest[]> {
  return guestRepo.getAllGuests();
}

export async function getGuestById(id: string): Promise<Guest | null> {
  return guestRepo.getGuestById(id);
}
