const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const assignmentRoutes = require('./routes/assignments');
const documentRoutes = require('./routes/documents');

// Load production environment variables
dotenv.config({ path: path.join(__dirname, '../.env.production') });

// Initialize passport
require('./config/passport');

const app = express();
const PORT = process.env.PORT || 5000;

// Production CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy for production (when behind reverse proxy)
if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}

// Production session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.COOKIE_SECURE === 'true',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'none'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Production'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/documents', documentRoutes);

// Serve static files from uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'LEARNIT API is running in production!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Production Error:', err);
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

app.listen(PORT, () => {
  console.log(`Production server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Client URL: ${process.env.CLIENT_URL}`);
});
