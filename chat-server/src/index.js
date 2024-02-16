const path = require("path");
const http = require("http");
// const http = require("http");
const express = require("express");
const socketio = require("socket.io");
var cors = require("cors");
const fs = require("fs");
const Filter = require("bad-words");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");
require("dotenv").config();

// const { joinEvent, leaveEvent, getJoinedUser, getJoinedUsers } = require("./utils/events");

const app = express();
const server = http.createServer(
  app
);

const io = socketio(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
})

app.use(express.static(__dirname));
const port = process.env.PORT || 5555;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New Connection - " + new Date());

  socket.on("joinEvent", (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });
    // console.log('joinEvent', error, user);
    if (error) {
      return callback(error);
    } else {
      socket.join(user.room);

      let users = getUsersInRoom(options.room);
      user.total_users = users.length;
      // console.log('----------', users);
      socket.broadcast.to(user.room).emit("newUserJoinedEvent", user);
      callback(user);
    }
  }); 

  socket.on("sendChatMessage", (data, callback) => {
    socket.broadcast.to(data.room).emit("newMessage", data);
    // socket.broadcast.emit("newMessage", data);
    callback();
  });
  socket.on("sendPeerId", (data, callback) => {
    console.log("send call is",data.peerID)
    socket.broadcast.to(data.room).emit("friendPeerId", data);
    callback();
  });
  socket.on("sendPeerIdOnCall", (data, callback) => {
    console.log("request For call id....",)

    socket.broadcast.to(data.room).emit("requestForPeerId", data);
    callback();
  });
  socket.on("leaveEvent", (data) => {
    const user = removeUser(socket.id);
    // console.log('leaveEvent', user);
    if (user) {
      let users = getUsersInRoom(data.room);
      user.total_users = users.length;
    }
    socket.broadcast.to(data.room).emit("userLeavedEvent", user);
  });

  socket.on("liveStatus", (options, callback) => {
    // console.log(options, callback)
    let users = getUsersInRoom(options.room);
    const existingUser = users.find((user) => {
      return user.room === options.room && user.user_id === options.user_id;
    });
    console.log("liveStatus", users, existingUser);
    callback(existingUser);
  });

  socket.on("disconnect", () => {
    // console.log(socket.id);
    const user = removeUser(socket.id);
    console.log("disconnect", user);
    if (user) {
      let users = getUsersInRoom(user.room);
      user.total_users = users.length;
      socket.broadcast.to(user.room).emit("userLeavedEvent", user);
    }
  });
});

app.get("/", (req, res) => {
  res.send("dkjsakjd");
});
server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
