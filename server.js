const express = require("express");
const app = express();
const server = require("http").createServer(app);
const socket = require("socket.io");
const io = socket(server);
app.use(express.static(`${__dirname}/client`));

const allUsers = [];

io.on("connect", (socket) => {
  const username = socket.handshake.query.username;

  allUsers.push({ username: username, socketID: socket.id });

  socket.emit("user-connected", {
    socketID: socket.id,
    users: allUsers,
  });
  socket.broadcast.emit("new-user-connected", allUsers);
  socket.on("send-message", (body) => {
    socket.broadcast.emit("receive-message", body);
  });
  socket.on("disconnect", () => {
    allUsers.splice(0, 1);
    socket.broadcast.emit("user-disconnected", {
      updatedUsers: allUsers,
      disconnectedUser: username,
    });
  });

  console.log(allUsers);
});

server.listen(8000, () => {
  console.log(`Server running on 8000`);
});
