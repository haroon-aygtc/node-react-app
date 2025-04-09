const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Mock user database
let users = [];

// User ID counter
let userId = 1;

// Mock User model
const User = {
  // Find user by email
  findOne: async ({ email }) => {
    const user = users.find(user => user.email === email);
    
    // Add select method to the returned user object
    if (user) {
      user.select = function(fields) {
        // If fields includes '+password', include password
        if (fields.includes('+password')) {
          return user;
        }
        // Otherwise, create a copy without password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      };
    }
    
    return user;
  },
  
  // Find user by ID
  findById: async (id) => {
    return users.find(user => user.id === id);
  },
  
  // Create new user
  create: async (userData) => {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Create user object
    const user = {
      id: userId++,
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'user',
      createdAt: new Date()
    };
    
    // Add methods
    user.getSignedJwtToken = function() {
      return jwt.sign(
        { id: this.id, role: this.role },
        config.jwtSecret,
        { expiresIn: config.jwtExpire }
      );
    };
    
    user.matchPassword = async function(enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    };
    
    // Add to users array
    users.push(user);
    
    return user;
  }
};

module.exports = { User };
