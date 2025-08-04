const jwt = require('jsonwebtoken');

const JWT_SECRET = 'gymManagementSecretKey2024ForJWTTokenGenerationAndValidation';

// Test token from the debug output
const testToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbIlJPTEVfQURNSU4iXSwiaWF0IjoxNzU0Mjk4MTU0LCJleHAiOjE3NTQzODQ1NTR9.w81TzpfQDNtBpljssjoYzl92lWIgsgs_eSWgsUG_3Mo';

console.log('🔍 Testing JWT Validation...\n');

try {
    // Decode without verification
    const decoded = jwt.decode(testToken);
    console.log('Decoded token (without verification):');
    console.log(JSON.stringify(decoded, null, 2));
    
    // Verify with the secret
    const verified = jwt.verify(testToken, JWT_SECRET);
    console.log('\n✅ Token verification successful:');
    console.log(JSON.stringify(verified, null, 2));
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    console.log('\nToken Analysis:');
    console.log('Current time:', now);
    console.log('Token expires at:', verified.exp);
    console.log('Token is expired:', verified.exp < now);
    
} catch (error) {
    console.error('❌ Token verification failed:', error.message);
}

// Test creating a new token
console.log('\n🔍 Testing token creation...');
try {
    const payload = {
        sub: 'admin',
        roles: ['ROLE_ADMIN'],
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400 // 24 hours
    };
    
    const newToken = jwt.sign(payload, JWT_SECRET);
    console.log('✅ New token created successfully');
    console.log('Token:', newToken);
    
    // Verify the new token
    const verifiedNewToken = jwt.verify(newToken, JWT_SECRET);
    console.log('✅ New token verification successful');
    console.log('Payload:', JSON.stringify(verifiedNewToken, null, 2));
    
} catch (error) {
    console.error('❌ Token creation failed:', error.message);
} 