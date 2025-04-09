const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const { error } = require('../utils/responseHandler');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  // Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return error(res, 'Not authorized to access this route', 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Set user in req
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return error(res, 'Not authorized to access this route', 401);
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return error(res, `User role ${req.user.role} is not authorized to access this route`, 403);
    }
    next();
  };
};
