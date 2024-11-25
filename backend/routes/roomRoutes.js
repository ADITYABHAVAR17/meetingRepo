const express = require("express");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// In-memory rooms object
const rooms = {}; 

// Route for creating a room
router.post("/", (req, res) => {
  const { roomName } = req.body;

  if (!roomName) {
    return res.status(400).json({ message: "Room name is required" });
  }

  const roomId = uuidv4(); // Generate unique room ID
  rooms[roomId] = { roomName, users: [] }; // Store room details

  res.status(201).json({ roomId, roomName });
});

module.exports = router;
