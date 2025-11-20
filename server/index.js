const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const assignmentRoutes = require('./routes/assignments');
const documentRoutes = require('./routes/documents');

dotenv.config();

require('./config/passport');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');

const rawAllowed = process.env.CLIENT_URLS || '';
const allowedOrigins = rawAllowed
  .split(',')
  .map(u => u.trim())
  .filter(Boolean);

// Add Vercel preview URLs
if (process.env.VERCEL_ENV === 'preview') {
  const vercelUrl = `https://${process.env.VERCEL_URL}`;
  if (!allowedOrigins.includes(vercelUrl)) {
    allowedOrigins.push(vercelUrl);
  }
}

// Configure CORS
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // Check if the origin is allowed
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Check for Vercel preview URLs
    if (process.env.VERCEL_ENV === 'preview' && origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    console.warn(`Blocked request from unauthorized origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
}));

// Trust first proxy (important for Vercel and Render)
app.set('trust proxy', 1);

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true, // Required for Vercel
  cookie: {
    secure: true, // Requires HTTPS
    sameSite: 'none', // Required for cross-site cookies
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    // Don't set domain here to allow all subdomains to access the cookie
  },
  name: 'learnit.sid' // Custom session cookie name
}));


app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/learnit', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/documents', documentRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ message: 'LEARNIT API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
