const { v4: uuidv4 } = require("uuid");

const rooms = {}; // In-memory store for rooms (replace with a database for production)

// Create a new room
exports.createRoom = (req, res) => {
  const roomId = uuidv4();
  rooms[roomId] = { participants: [] }; // Initialize room with empty participants
  console.log(`Room created: ${roomId}`);
  res.status(201).json({ success: true, roomId });
};

// Get room details
exports.getRoomDetails = (req, res) => {
  const { roomId } = req.params;
  const room = rooms[roomId];

  if (!room) {
    return res.status(404).json({ success: false, message: "Room not found" });
  }

  res.status(200).json({ success: true, room });
};
