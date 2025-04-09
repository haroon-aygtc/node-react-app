/**
 * Standard success response
 * @param {Object} res - Express response object
 * @param {String} message - Success message
 * @param {*} data - Response data
 * @param {Number} statusCode - HTTP status code
 */
exports.success = (res, message = 'Operation successful', data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

/**
 * Standard error response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code
 * @param {*} data - Additional error data
 */
exports.error = (res, message = 'An error occurred', statusCode = 400, data = null) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    data
  });
};

/**
 * Validation error response
 * @param {Object} res - Express response object
 * @param {Array} errors - Validation errors
 * @param {String} message - Error message
 */
exports.validationError = (res, errors, message = 'Validation failed') => {
  return res.status(422).json({
    status: 'error',
    message,
    data: { errors }
  });
};
