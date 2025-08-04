const axios = require('axios');

const BACKEND_URL = 'http://localhost:8080';
const FRONTEND_URL = 'http://localhost:3000';

async function testBackendConnection() {
  console.log('🔍 Testing Backend Connection...');
  
  try {
    // Test basic connectivity
    const response = await axios.get(`${BACKEND_URL}/api/test/all`);
    console.log('✅ Backend is running and accessible');
    console.log('   Response:', response.data);
  } catch (error) {
    console.log('❌ Backend connection failed');
    console.log('   Error:', error.message);
    return false;
  }
  
  return true;
}

async function testFrontendConnection() {
  console.log('\n🔍 Testing Frontend Connection...');
  
  try {
    // Test if frontend is running
    const response = await axios.get(FRONTEND_URL);
    console.log('✅ Frontend is running and accessible');
  } catch (error) {
    console.log('❌ Frontend connection failed');
    console.log('   Error:', error.message);
    return false;
  }
  
  return true;
}

async function testAuthentication() {
  console.log('\n🔍 Testing Authentication...');
  
  try {
    // Test login endpoint
    const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/signin`, {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('✅ Authentication endpoint is working');
    console.log('   Token received:', loginResponse.data.accessToken ? 'Yes' : 'No');
    
    // Test protected endpoint with token
    const token = loginResponse.data.accessToken;
    const protectedResponse = await axios.get(`${BACKEND_URL}/api/test/admin`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Protected endpoints are working');
    console.log('   Response:', protectedResponse.data);
    
  } catch (error) {
    console.log('❌ Authentication test failed');
    console.log('   Error:', error.response?.data?.message || error.message);
    return false;
  }
  
  return true;
}

async function runTests() {
  console.log('🚀 Gym Management System - Connection Test\n');
  
  const backendOk = await testBackendConnection();
  const frontendOk = await testFrontendConnection();
  const authOk = await testAuthentication();
  
  console.log('\n📊 Test Results:');
  console.log(`   Backend: ${backendOk ? '✅ OK' : '❌ FAILED'}`);
  console.log(`   Frontend: ${frontendOk ? '✅ OK' : '❌ FAILED'}`);
  console.log(`   Authentication: ${authOk ? '✅ OK' : '❌ FAILED'}`);
  
  if (backendOk && frontendOk && authOk) {
    console.log('\n🎉 All tests passed! Your system is properly connected.');
    console.log('\n📝 Next steps:');
    console.log('   1. Open http://localhost:3000 in your browser');
    console.log('   2. Login with username: admin, password: admin123');
    console.log('   3. Explore the different features based on your role');
  } else {
    console.log('\n⚠️  Some tests failed. Please check:');
    console.log('   1. Backend is running on port 8080');
    console.log('   2. Frontend is running on port 3000');
    console.log('   3. Database is properly configured');
    console.log('   4. All dependencies are installed');
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testBackendConnection, testFrontendConnection, testAuthentication }; 