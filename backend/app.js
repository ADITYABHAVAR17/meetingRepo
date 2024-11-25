const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const roomRoutes = require('./routes/roomRoutes'); // Add room-related routes

const app = express();

// Enable CORS (Make sure React can send requests)
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from React
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// API routes
app.use('/api/rooms', roomRoutes); // Handle /api/rooms route

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// Error Middleware (Make sure you have this for error handling)
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
