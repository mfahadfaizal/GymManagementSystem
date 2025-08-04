const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080';

// Function to decode JWT without verification (for debugging)
function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    
    return { header, payload };
  } catch (error) {
    console.error('Error decoding JWT:', error.message);
    return null;
  }
}

async function debugJWT() {
  console.log('🔍 Debugging JWT Token...\n');

  try {
    // Step 1: Get token
    console.log('1. Getting JWT token...');
    const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/signin`, {
      username: 'admin',
      password: 'admin123'
    });
    
    const token = loginResponse.data.accessToken;
    console.log('✅ Token received');
    
    // Step 2: Decode token
    console.log('\n2. Decoding JWT token...');
    const decoded = decodeJWT(token);
    
    if (decoded) {
      console.log('Header:', JSON.stringify(decoded.header, null, 2));
      console.log('Payload:', JSON.stringify(decoded.payload, null, 2));
      
      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      const exp = decoded.payload.exp;
      const iat = decoded.payload.iat;
      
      console.log('\nToken Analysis:');
      console.log('Current time:', now);
      console.log('Issued at:', iat);
      console.log('Expires at:', exp);
      console.log('Token age (seconds):', now - iat);
      console.log('Time until expiry (seconds):', exp - now);
      console.log('Token valid:', exp > now ? 'Yes' : 'No');
      
      // Check roles
      const roles = decoded.payload.roles;
      console.log('Roles in token:', roles);
      
    } else {
      console.log('❌ Failed to decode JWT token');
    }
    
    // Step 3: Test with different header formats
    console.log('\n3. Testing different Authorization header formats...');
    
    const testHeaders = [
      { 'Authorization': `Bearer ${token}` },
      { 'Authorization': `bearer ${token}` },
      { 'authorization': `Bearer ${token}` },
      { 'authorization': `bearer ${token}` },
      { 'Authorization': token },
      { 'Authorization': `Bearer ${token.trim()}` }
    ];
    
    for (let i = 0; i < testHeaders.length; i++) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users`, { 
          headers: { ...testHeaders[i], 'Content-Type': 'application/json' }
        });
        console.log(`✅ Format ${i + 1} (${Object.keys(testHeaders[i])[0]}): ${response.status}`);
      } catch (error) {
        console.log(`❌ Format ${i + 1} (${Object.keys(testHeaders[i])[0]}): ${error.response?.status} - ${error.response?.data?.message}`);
      }
    }
    
    // Step 4: Test with curl-like request
    console.log('\n4. Testing with detailed request...');
    try {
      const response = await axios({
        method: 'GET',
        url: `${API_BASE_URL}/api/users`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        validateStatus: function (status) {
          return status < 500; // Accept all status codes less than 500
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response data:', response.data);
      
    } catch (error) {
      console.log('Error:', error.message);
      if (error.response) {
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
        console.log('Response data:', error.response.data);
      }
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the debug
debugJWT(); 