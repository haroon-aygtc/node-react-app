const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Test login
async function testLogin() {
  try {
    console.log('Testing login...');
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Login successful:', response.data);
    return response.data.data.token;
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    return null;
  }
}

// Run test
testLogin();
