const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./middleware/errorMiddleware");
const roomRoutes = require("./routes/roomRoutes"); // Import room-related routes

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Parse cookies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(fileUpload()); // Handle file uploads

// API Routes
app.use("/api/v1/rooms", roomRoutes); // Room-related routes

// Serve frontend (React build folder)
const frontendPath = path.join(__dirname, "../frontend/build");
app.use(express.static(frontendPath)); // Serve static files from React's build folder

app.get("*", (req, res) => {
  res.sendFile(path.resolve(frontendPath, "index.html"));
});

// Error Middleware (should be after routes)
app.use(errorMiddleware);

module.exports = app;
