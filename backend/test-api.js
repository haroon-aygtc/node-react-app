const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Test user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

// Test admin data
const testAdmin = {
  name: 'Test Admin',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin'
};

// Store token for authenticated requests
let token = '';

// Helper function to log responses
const logResponse = (title, response) => {
  console.log('\n' + '='.repeat(50));
  console.log(`${title}:`);
  console.log('Status:', response.status);
  console.log('Data:', JSON.stringify(response.data, null, 2));
  console.log('='.repeat(50) + '\n');
};

// Test registration
const testRegister = async () => {
  try {
    console.log('Testing user registration...');
    const response = await axios.post(`${API_URL}/auth/register`, testUser);
    logResponse('Register Response', response);
    return response.data.data.token;
  } catch (error) {
    console.error('Registration Error:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test admin registration
const testAdminRegister = async () => {
  try {
    console.log('Testing admin registration...');
    const response = await axios.post(`${API_URL}/auth/register`, testAdmin);
    logResponse('Admin Register Response', response);
    return response.data.data.token;
  } catch (error) {
    console.error('Admin Registration Error:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test login
const testLogin = async (email, password) => {
  try {
    console.log(`Testing login for ${email}...`);
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    logResponse('Login Response', response);
    return response.data.data.token;
  } catch (error) {
    console.error('Login Error:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test get current user
const testGetMe = async (token) => {
  try {
    console.log('Testing get current user...');
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    logResponse('Get Me Response', response);
  } catch (error) {
    console.error('Get Me Error:', error.response ? error.response.data : error.message);
  }
};

// Run all tests
const runTests = async () => {
  console.log('Starting API tests...');
  
  // Test registration
  let userToken = await testRegister();
  
  // Test admin registration
  let adminToken = await testAdminRegister();
  
  // Test login with user
  if (!userToken) {
    userToken = await testLogin(testUser.email, testUser.password);
  }
  
  // Test login with admin
  if (!adminToken) {
    adminToken = await testLogin(testAdmin.email, testAdmin.password);
  }
  
  // Test get current user with user token
  if (userToken) {
    await testGetMe(userToken);
  }
  
  // Test get current user with admin token
  if (adminToken) {
    await testGetMe(adminToken);
  }
  
  console.log('All tests completed!');
};

// Run the tests
runTests();
