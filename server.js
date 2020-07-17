const express = require("express");
const app = express();
const server = require("http").createServer(app);
const socket = require("socket.io");
const io = socket(server);
app.use(express.static(`${__dirname}/client`));

const allUsers = [];

io.on("connect", (socket) => {
  const username = socket.handshake.query.username;

  socket.emit("user-connected", {
    socketID: socket.id,
    users: allUsers,
  });
  socket.broadcast.emit("new-user-connected", allUsers);
  socket.on("send-message", (messageObj) => {
    socket.broadcast.emit("receive-message", messageObj);
  });

  socket.on("send-private-message", (messageObj) => {
    socket.broadcast
      .to(messageObj.receiverID)
      .emit("receive-private-message", messageObj);
  });

  socket.on("disconnect", () => {
    const indexOfDisconnectedUser = allUsers.findIndex(
      (user) => user.socketID === socket.id
    );
    allUsers.splice(indexOfDisconnectedUser, 1);
    socket.broadcast.emit("user-disconnected", {
      updatedUsers: allUsers,
      disconnectedUser: username,
    });
  });
});

server.listen(8000, () => {
  console.log(`Server running on 8000`);
});
