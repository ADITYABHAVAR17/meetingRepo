module.exports = (io, rooms) => {
  io.on("connection", (socket) => {
    socket.emit("me", socket.id);
    console.log("connected: ", socket.id);

    socket.on("disconnect", () => {
      socket.broadcast.emit("callEnded");
      console.log("disconnected: ", socket.id);
    });

    socket.on("callUser", (data) => {
      io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name });
      // console.log(data.signalData);
    });

    socket.on("answerCall", (data) => {
      io.to(data.to).emit("callAccepted", data.signal);
      // console.log(data.signal);
    });

    socket.on("joinRoom", ({ roomId, userName }) => {
      // Ensure rooms exists and roomId is valid
      if (!rooms || !rooms[roomId]) {
        socket.emit("error", { message: "Room does not exist" });
        return;
      }

      socket.join(roomId);
      rooms[roomId].users.push({ id: socket.id, userName });

      // Notify other users about the new user
      socket.to(roomId).emit("newUser", { id: socket.id, userName });

      console.log(`${userName} joined room: ${roomId}`);
    });
  });
};
