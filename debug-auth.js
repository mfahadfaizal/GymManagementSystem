const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080';

async function debugAuthentication() {
  console.log('🔍 Debugging Authentication Flow...\n');

  try {
    // Step 1: Test login
    console.log('1. Testing login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/signin`, {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('✅ Login successful');
    console.log('Response status:', loginResponse.status);
    console.log('User data:', loginResponse.data);
    
    const token = loginResponse.data.accessToken;
    console.log('Token received:', token ? 'Yes' : 'No');
    console.log('Token length:', token ? token.length : 0);
    console.log('Token preview:', token ? `${token.substring(0, 50)}...` : 'None');
    
    // Step 2: Test token validation
    console.log('\n2. Testing token validation...');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Test a protected endpoint
    const testResponse = await axios.get(`${API_BASE_URL}/api/users`, { headers });
    console.log('✅ Protected endpoint accessible');
    console.log('Response status:', testResponse.status);
    console.log('Users count:', testResponse.data.length);
    
    // Step 3: Test different endpoints
    console.log('\n3. Testing various endpoints...');
    
    const endpoints = [
      '/api/memberships',
      '/api/equipment', 
      '/api/gym-classes',
      '/api/training-sessions',
      '/api/class-registrations',
      '/api/payments'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${API_BASE_URL}${endpoint}`, { headers });
        console.log(`✅ ${endpoint}: ${response.status} (${response.data.length} items)`);
      } catch (error) {
        console.log(`❌ ${endpoint}: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
    }
    
    // Step 4: Test without token
    console.log('\n4. Testing without token (should fail)...');
    try {
      await axios.get(`${API_BASE_URL}/api/users`);
      console.log('❌ Should have failed but didn\'t');
    } catch (error) {
      console.log('✅ Correctly rejected without token');
      console.log('Error status:', error.response?.status);
      console.log('Error message:', error.response?.data?.message);
    }
    
    // Step 5: Test with invalid token
    console.log('\n5. Testing with invalid token...');
    try {
      await axios.get(`${API_BASE_URL}/api/users`, {
        headers: { 'Authorization': 'Bearer invalid-token' }
      });
      console.log('❌ Should have failed but didn\'t');
    } catch (error) {
      console.log('✅ Correctly rejected invalid token');
      console.log('Error status:', error.response?.status);
      console.log('Error message:', error.response?.data?.message);
    }
    
    console.log('\n🎉 Authentication debug completed successfully!');
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the debug
debugAuthentication(); 