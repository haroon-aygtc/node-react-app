import * as guestRepo from '../repositories/guestRepository';
export async function registerGuest(data) {
    if (!data.fullName.trim())
        throw new Error('Full name is required');
    if (!data.email.trim())
        throw new Error('Email is required');
    return guestRepo.registerGuest(data);
}
export async function getAllGuests() {
    return guestRepo.getAllGuests();
}
export async function getGuestById(id) {
    return guestRepo.getGuestById(id);
}
