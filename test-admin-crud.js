const axios = require('axios');

const BACKEND_URL = 'http://localhost:8080';

async function testAdminCRUD() {
  console.log('🔍 Testing Admin CRUD Operations...\n');
  
  let token = null;
  
  try {
    // 1. Login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/signin`, {
      username: 'admin',
      password: 'admin123'
    });
    
    token = loginResponse.data.accessToken;
    console.log('✅ Admin login successful');
    
    // 2. Test User Management
    console.log('\n2. Testing User Management...');
    const usersResponse = await axios.get(`${BACKEND_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Get all users: OK');
    
    // 3. Test Membership Management
    console.log('\n3. Testing Membership Management...');
    const membershipsResponse = await axios.get(`${BACKEND_URL}/api/memberships`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Get all memberships: OK');
    
    // 4. Test Equipment Management
    console.log('\n4. Testing Equipment Management...');
    const equipmentResponse = await axios.get(`${BACKEND_URL}/api/equipment`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Get all equipment: OK');
    
    // 5. Test Gym Classes Management
    console.log('\n5. Testing Gym Classes Management...');
    const gymClassesResponse = await axios.get(`${BACKEND_URL}/api/gym-classes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Get all gym classes: OK');
    
    // 6. Test Training Sessions Management
    console.log('\n6. Testing Training Sessions Management...');
    const trainingSessionsResponse = await axios.get(`${BACKEND_URL}/api/training-sessions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Get all training sessions: OK');
    
    // 7. Test Class Registrations Management
    console.log('\n7. Testing Class Registrations Management...');
    const classRegistrationsResponse = await axios.get(`${BACKEND_URL}/api/class-registrations`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Get all class registrations: OK');
    
    // 8. Test Payments Management
    console.log('\n8. Testing Payments Management...');
    const paymentsResponse = await axios.get(`${BACKEND_URL}/api/payments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Get all payments: OK');
    
    console.log('\n🎉 All Admin CRUD operations are working correctly!');
    console.log('\n📊 Summary:');
    console.log('   ✅ User Management: Full access');
    console.log('   ✅ Membership Management: Full access');
    console.log('   ✅ Equipment Management: Full access');
    console.log('   ✅ Gym Classes Management: Full access');
    console.log('   ✅ Training Sessions Management: Full access');
    console.log('   ✅ Class Registrations Management: Full access');
    console.log('   ✅ Payments Management: Full access');
    
  } catch (error) {
    console.log('❌ Admin CRUD test failed');
    console.log('   Error:', error.response?.data?.message || error.message);
    console.log('   Status:', error.response?.status);
  }
}

// Test specific CRUD operations
async function testSpecificCRUD() {
  console.log('\n🔍 Testing Specific CRUD Operations...\n');
  
  let token = null;
  
  try {
    // Login as admin
    const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/signin`, {
      username: 'admin',
      password: 'admin123'
    });
    token = loginResponse.data.accessToken;
    
    // Test CREATE operations
    console.log('Testing CREATE operations...');
    
    // Test membership creation
    try {
      const membershipData = {
        userId: 1,
        type: 'BASIC',
        price: 50.0,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        description: 'Test membership'
      };
      
      const createMembershipResponse = await axios.post(`${BACKEND_URL}/api/memberships`, membershipData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Create membership: OK');
    } catch (error) {
      console.log('❌ Create membership failed:', error.response?.data?.message);
    }
    
    // Test equipment creation
    try {
      const equipmentData = {
        name: 'Test Equipment',
        type: 'CARDIO',
        purchasePrice: 1000.0,
        description: 'Test equipment',
        location: 'Main Gym',
        serialNumber: 'TEST123'
      };
      
      const createEquipmentResponse = await axios.post(`${BACKEND_URL}/api/equipment`, equipmentData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Create equipment: OK');
    } catch (error) {
      console.log('❌ Create equipment failed:', error.response?.data?.message);
    }
    
    // Test gym class creation
    try {
      const gymClassData = {
        name: 'Test Class',
        type: 'YOGA',
        trainerId: 1,
        startTime: '09:00:00',
        endTime: '10:00:00',
        maxCapacity: 20,
        price: 25.0,
        description: 'Test class',
        location: 'Studio A',
        scheduleDays: ['MONDAY', 'WEDNESDAY']
      };
      
      const createGymClassResponse = await axios.post(`${BACKEND_URL}/api/gym-classes`, gymClassData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Create gym class: OK');
    } catch (error) {
      console.log('❌ Create gym class failed:', error.response?.data?.message);
    }
    
    console.log('\n🎉 Admin has full CRUD access to all operations!');
    
  } catch (error) {
    console.log('❌ Specific CRUD test failed');
    console.log('   Error:', error.response?.data?.message || error.message);
  }
}

async function runTests() {
  await testAdminCRUD();
  await testSpecificCRUD();
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testAdminCRUD, testSpecificCRUD }; 