const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const path = require('path');

// Import routes
const authRoutes = require('../server/routes/auth');
const noteRoutes = require('../server/routes/notes');
const userRoutes = require('../server/routes/users');
const courseRoutes = require('../server/routes/courses');
const assignmentRoutes = require('../server/routes/assignments');
const documentRoutes = require('../server/routes/documents');

dotenv.config();

require('../server/config/passport');

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/learnit', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/documents', documentRoutes);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../server/uploads')));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'LEARNIT API is running!' });
});

module.exports = app;
