const express = require('express');
const { check } = require('express-validator');
const {
  registerGuest,
  getGuestById,
  getAllGuests,
  addMessageToChatSession,
  getChatSessionMessages
} = require('../controllers/guestController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post(
  '/register',
  [
    check('fullName', 'Full name is required').not().isEmpty(),
    check('phone', 'Valid phone number is required').not().isEmpty(),
    check('email', 'Valid email is optional').optional().isEmail()
  ],
  registerGuest
);

router.post(
  '/chat/:sessionId',
  [
    check('content', 'Message content is required').not().isEmpty(),
    check('sender', 'Sender must be user or assistant').isIn(['user', 'assistant'])
  ],
  addMessageToChatSession
);

router.get('/chat/:sessionId', getChatSessionMessages);

// Protected admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllGuests);
router.get('/:id', getGuestById);

module.exports = router;
