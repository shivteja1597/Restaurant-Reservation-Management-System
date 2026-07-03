require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const seedCustomer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const customerExists = await User.findOne({ email: 'customer@test.com' });
    if (customerExists) {
      console.log('Customer account already exists.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('customer123', salt);

    await User.create({
      name: 'Test Customer',
      email: 'customer@test.com',
      phone: '1234567890',
      password: hashedPassword,
      role: 'customer'
    });

    console.log('Customer account created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating customer:', error);
    process.exit(1);
  }
};

seedCustomer();
