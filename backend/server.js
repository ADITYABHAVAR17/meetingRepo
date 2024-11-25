const http = require("http");
const express = require("express");
const cors = require("cors");
const app = require("./app"); // Import Express app
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Make sure this matches your frontend URL
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const rooms = {}; // Store room details and users

// Create a room
app.post("/api/rooms", (req, res) => {
  const { roomName } = req.body;
  if (!roomName) {
    return res.status(400).json({ message: "Room name is required" });
  }

  const roomId = uuidv4();
  rooms[roomId] = { roomName, users: [] };
  res.status(201).json({ roomId, roomName });
});

// Socket.io logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room
  socket.on("joinRoom", ({ roomId, userName }) => {
    if (!rooms[roomId]) {
      socket.emit("error", { message: "Room does not exist" });
      return;
    }

    socket.join(roomId);
    rooms[roomId].users.push({ id: socket.id, userName });

    console.log(`${userName} joined room: ${roomId}`);

    // Notify others in the room
    socket.to(roomId).emit("userJoined", { userName });

    // Send room welcome message to the new user
    socket.emit("message", {
      userName: "System",
      message: `Welcome to the room, ${userName}!`,
    });
  });

  // Send chat message
  socket.on("chatMessage", ({ roomId, userName, message }) => {
    if (!rooms[roomId]) {
      socket.emit("error", { message: "Room does not exist" });
      return;
    }

    const chatMessage = { userName,message };
    io.to(roomId).emit("message", chatMessage); // Broadcast to everyone in the room
    console.log(`Message from ${userName} in room ${roomId}: ${message}`);
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      const userIndex = rooms[roomId].users.findIndex(
        (user) => user.id === socket.id
      );
      if (userIndex !== -1) {
        const userName = rooms[roomId].users[userIndex].userName;
        rooms[roomId].users.splice(userIndex, 1);

        // Notify others in the room
        socket.to(roomId).emit("userLeft", { userName });
        console.log(`${userName} left room: ${roomId}`);
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
