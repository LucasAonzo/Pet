const { User } = require('../models');

const createTestUser = async () => {
  try {
    // Create test user
    const testUser = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'test123', // This will be hashed by the beforeCreate hook
      phone: '+1 (555) 111-2222',
      role: 'user',
      city: 'Test City',
      state: 'TS',
      isVerified: true,
      isActive: true
    });
    
    console.log('Test user created successfully:', testUser.email);
    console.log('Password is: test123');
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    process.exit();
  }
};

// Run the function
createTestUser(); 