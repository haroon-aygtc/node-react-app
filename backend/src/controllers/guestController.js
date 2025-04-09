const User = require('../models/User');
const ChatSession = require('../models/ChatSession');
const AIModel = require('../models/AIModel');
const { validationResult } = require('express-validator');
const { success, error, validationError } = require('../utils/responseHandler');

// @desc    Register guest user
// @route   POST /api/guest/register
// @access  Public
exports.registerGuest = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationError(res, errors.array());
    }

    const { fullName, email, phone } = req.body;

    // Create guest user
    const guestUser = await User.createGuest({
      fullName,
      email,
      phone
    });

    // Create a new chat session for the guest
    const activeAIModel = await AIModel.findActive();

    const chatSession = await ChatSession.create({
      guestUserId: guestUser.id,
      aiModelId: activeAIModel ? activeAIModel.id : null,
      isActive: true
    });

    return success(
      res,
      'Guest registered successfully',
      {
        user: {
          id: guestUser.id,
          name: guestUser.name,
          email: guestUser.email,
          role: guestUser.role,
          userType: guestUser.user_type,
          phone: guestUser.phone,
          createdAt: guestUser.created_at
        },
        sessionId: chatSession.id,
        token: User.getSignedJwtToken(guestUser)
      },
      201
    );
  } catch (err) {
    console.error('Register guest error:', err);
    return error(res, 'Server error', 500);
  }
};

// @desc    Get guest user by ID
// @route   GET /api/guest/:id
// @access  Private/Admin
exports.getGuestById = async (req, res) => {
  try {
    const guestUser = await User.findById(req.params.id);

    if (!guestUser || guestUser.user_type !== 'guest') {
      return error(res, 'Guest user not found', 404);
    }

    // Get chat sessions for this guest
    const chatSessions = await ChatSession.getSessionsByGuestId(guestUser.id);

    return success(
      res,
      'Guest user retrieved successfully',
      {
        guestUser: {
          id: guestUser.id,
          name: guestUser.name,
          email: guestUser.email,
          phone: guestUser.phone,
          createdAt: guestUser.created_at,
          lastActive: guestUser.last_login
        },
        chatSessions
      }
    );
  } catch (err) {
    console.error('Get guest error:', err);
    return error(res, 'Server error', 500);
  }
};

// @desc    Get all guest users
// @route   GET /api/guest
// @access  Private/Admin
exports.getAllGuests = async (req, res) => {
  try {
    const guestUsers = await User.findAllGuests();

    // Format the response
    const formattedGuests = guestUsers.map(guest => ({
      id: guest.id,
      name: guest.name,
      email: guest.email,
      phone: guest.phone,
      createdAt: guest.created_at,
      lastActive: guest.last_login
    }));

    return success(
      res,
      'Guest users retrieved successfully',
      { guestUsers: formattedGuests }
    );
  } catch (err) {
    console.error('Get all guests error:', err);
    return error(res, 'Server error', 500);
  }
};

// @desc    Add message to chat session
// @route   POST /api/guest/chat/:sessionId
// @access  Public
exports.addMessageToChatSession = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationError(res, errors.array());
    }

    const { content, sender } = req.body;
    const { sessionId } = req.params;

    // Find chat session
    const chatSession = await ChatSession.findById(sessionId);

    if (!chatSession) {
      return error(res, 'Chat session not found', 404);
    }

    // Add message to chat session
    const message = await ChatSession.addMessage(sessionId, {
      content,
      sender
    });

    // Update last active time for guest user
    if (chatSession.guest_user_id) {
      await User.updateLastLogin(chatSession.guest_user_id);
    }

    // Get AI response (in a real implementation, this would call the AI service)
    let aiResponse = null;
    if (sender === 'user') {
      // Get the active AI model
      const activeModel = await AIModel.findActive();

      // Simulate AI response
      const responseText = `This is a simulated AI response to: "${content}" using ${activeModel ? activeModel.name : 'default AI model'}`;

      // Add AI response to chat session
      aiResponse = await ChatSession.addMessage(sessionId, {
        content: responseText,
        sender: 'assistant'
      });
    }

    return success(
      res,
      'Message added successfully',
      {
        message,
        aiResponse
      }
    );
  } catch (err) {
    console.error('Add message error:', err);
    return error(res, 'Server error', 500);
  }
};

// @desc    Get chat session messages
// @route   GET /api/guest/chat/:sessionId
// @access  Public
exports.getChatSessionMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Find chat session
    const chatSession = await ChatSession.findById(sessionId);

    if (!chatSession) {
      return error(res, 'Chat session not found', 404);
    }

    return success(
      res,
      'Chat session messages retrieved successfully',
      { messages: await ChatSession.getMessages(sessionId) }
    );
  } catch (err) {
    console.error('Get chat messages error:', err);
    return error(res, 'Server error', 500);
  }
};
