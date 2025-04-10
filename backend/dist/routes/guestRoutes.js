import { Router } from 'express';
import * as guestController from '../controllers/guestController';
const router = Router();
router.post('/register', guestController.registerGuest);
router.get('/', guestController.getAllGuests);
router.get('/:id', guestController.getGuestById);
export default router;
