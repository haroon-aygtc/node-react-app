// Use MySQL User model
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { success, error, validationError } = require('../utils/responseHandler');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationError(res, errors.array());
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    let user = await User.findByEmail(email);
    if (user) {
      return error(res, 'User already exists', 400);
    }

    // Create user
    user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    // Generate token
    const token = User.getSignedJwtToken(user);

    // Return response
    return success(
      res,
      'User registered successfully',
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          userType: user.user_type,
          phone: user.phone,
          profileImage: user.profile_image,
          createdAt: user.created_at
        },
        token
      },
      201
    );
  } catch (err) {
    console.error('Register error:', err);
    return error(res, 'Server error', 500);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationError(res, errors.array());
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findByEmail(email);

    // Check if user exists
    if (!user) {
      return error(res, 'Invalid credentials', 401);
    }

    // Check if password matches
    const isMatch = await User.matchPassword(password, user.password);
    if (!isMatch) {
      return error(res, 'Invalid credentials', 401);
    }

    // Update last login time
    await User.updateLastLogin(user.id);

    // Generate token
    const token = User.getSignedJwtToken(user);

    // Return response
    return success(
      res,
      'Login successful',
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          userType: user.user_type,
          phone: user.phone,
          profileImage: user.profile_image,
          lastLogin: user.last_login,
          createdAt: user.created_at
        },
        token
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    return error(res, 'Server error', 500);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    return success(
      res,
      'User retrieved successfully',
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          userType: user.user_type,
          phone: user.phone,
          profileImage: user.profile_image,
          lastLogin: user.last_login,
          createdAt: user.created_at,
          isActive: user.is_active
        }
      }
    );
  } catch (err) {
    console.error('Get me error:', err);
    return error(res, 'Server error', 500);
  }
};
