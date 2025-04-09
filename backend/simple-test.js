const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Test registration
async function testRegister() {
  try {
    console.log('Testing registration...');
    const response = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Registration successful:', response.data);
    return response.data.data.token;
  } catch (error) {
    console.error('Registration error:', error.response ? error.response.data : error.message);
    return null;
  }
}

// Run test
testRegister();
