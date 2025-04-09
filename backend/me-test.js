const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Get token from login
async function login() {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    return response.data.data.token;
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    return null;
  }
}

// Test get current user
async function testGetMe(token) {
  try {
    console.log('Testing get current user...');
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Get current user successful:', response.data);
  } catch (error) {
    console.error('Get current user error:', error.response ? error.response.data : error.message);
  }
}

// Run tests
async function runTests() {
  const token = await login();
  if (token) {
    await testGetMe(token);
  } else {
    console.log('Login failed, cannot test protected route');
  }
}

runTests();
