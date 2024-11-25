module.exports = (socket, io) => {
    // Join room
    socket.on("join-room", ({ roomId, userName }) => {
      console.log(`${userName} joined room: ${roomId}`);
      socket.join(roomId);
  
      // Notify other participants
      socket.to(roomId).emit("user-joined", { userName, socketId: socket.id });
  
      // Handle chat messages
      socket.on("send-message", ({ message }) => {
        io.to(roomId).emit("receive-message", { message, userName });
      });
  
      // Handle user disconnect
      socket.on("disconnect", () => {
        console.log(`${userName} disconnected from room: ${roomId}`);
        socket.to(roomId).emit("user-left", { userName });
      });
    });
  };
  