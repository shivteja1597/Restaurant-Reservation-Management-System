require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();
const PORT = process.env.PORT || 5000;

// General Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // Allow only the frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Security Middleware
app.use(helmet()); // Secure HTTP headers

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased to 1000 for development testing
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiter to all API routes
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tables', require('./routes/tableRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));

// Basic Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running smoothly!' });
});

const Table = require('./models/Table');

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connection established successfully');
    
    // Seed tables if none exist
    try {
      const count = await Table.countDocuments();
      if (count === 0) {
        const defaultTables = [
          { tableNumber: 1, capacity: 2, isActive: true },
          { tableNumber: 2, capacity: 2, isActive: true },
          { tableNumber: 3, capacity: 4, isActive: true },
          { tableNumber: 4, capacity: 4, isActive: true },
          { tableNumber: 5, capacity: 6, isActive: true },
          { tableNumber: 6, capacity: 8, isActive: true },
        ];
        await Table.insertMany(defaultTables);
        console.log('Successfully seeded 6 default tables on startup!');
      }
    } catch (err) {
      console.error('Error checking/seeding tables on startup:', err);
    }
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
