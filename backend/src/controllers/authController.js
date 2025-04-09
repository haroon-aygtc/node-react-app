// Use mock database for testing
const { User } = require('../utils/mockDb');
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
    let user = await User.findOne({ email });
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
    const token = user.getSignedJwtToken();

    // Return response
    return success(
      res,
      'User registered successfully',
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
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
    const user = await User.findOne({ email });

    // In a real app, we would use .select('+password') to include the password
    // but our mock DB handles this differently
    if (!user) {
      return error(res, 'Invalid credentials', 401);
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return error(res, 'Invalid credentials', 401);
    }

    // Generate token
    const token = user.getSignedJwtToken();

    // Return response
    return success(
      res,
      'Login successful',
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
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
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    );
  } catch (err) {
    console.error('Get me error:', err);
    return error(res, 'Server error', 500);
  }
};
