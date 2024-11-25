const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const path = require("path"); // Import path to handle file paths

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const rooms = {}; // Store room details and users

// Serve React build folder
app.use(express.static(path.join(__dirname, "../frontend/build")));

// API route to create a room
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

  socket.on("joinRoom", ({ roomId, userName }) => {
    if (!rooms[roomId]) {
      socket.emit("error", { message: "Room does not exist" });
      return;
    }

    socket.join(roomId);
    rooms[roomId].users.push({ id: socket.id, userName });

    console.log(`${userName} joined room: ${roomId}`);

    socket.to(roomId).emit("userJoined", { userName });

    socket.emit("message", {
      userName: "System",
      message: `Welcome to the room, ${userName}!`,
    });
  });

  socket.on("chatMessage", ({ roomId, userName, message }) => {
    if (!rooms[roomId]) {
      socket.emit("error", { message: "Room does not exist" });
      return;
    }

    const chatMessage = { userName, message };
    io.to(roomId).emit("message", chatMessage);
    console.log(`Message from ${userName} in room ${roomId}: ${message}`);
  });

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      const userIndex = rooms[roomId].users.findIndex(
        (user) => user.id === socket.id
      );
      if (userIndex !== -1) {
        const userName = rooms[roomId].users[userIndex].userName;
        rooms[roomId].users.splice(userIndex, 1);

        socket.to(roomId).emit("userLeft", { userName });
        console.log(`${userName} left room: ${roomId}`);
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

// Handle React routing
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
