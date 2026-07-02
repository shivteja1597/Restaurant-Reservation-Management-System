require('dotenv').config();
const mongoose = require('mongoose');
const Table = require('./src/models/Table');

const seedTables = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Check if tables already exist
    const count = await Table.countDocuments();
    if (count > 0) {
      console.log('Tables already exist in the database. Exiting.');
      process.exit(0);
    }

    const tables = [
      { tableNumber: 1, capacity: 2, isActive: true },
      { tableNumber: 2, capacity: 2, isActive: true },
      { tableNumber: 3, capacity: 4, isActive: true },
      { tableNumber: 4, capacity: 4, isActive: true },
      { tableNumber: 5, capacity: 6, isActive: true },
      { tableNumber: 6, capacity: 8, isActive: true },
    ];

    await Table.insertMany(tables);
    console.log('Successfully seeded 6 tables into the database!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding tables:', error);
    process.exit(1);
  }
};

seedTables();
