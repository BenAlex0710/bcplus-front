const path = require("path");
const http = require("https");
// const http = require("http");
const express = require("express");
const socketio = require("socket.io");
var cors = require('cors')
const fs = require('fs');
const Filter = require("bad-words");
const { generateMessage, generateLocationMessage } = require("./utils/messages");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./utils/users");

const app = express();
const server = http.createServer({
    key: fs.readFileSync('/../ssl/server-key.pem'),
    cert: fs.readFileSync('/../ssl/server-cert.pem')
}, app);
const io = socketio(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

require("dotenv").config();

const port = process.env.PORT || 5000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", socket => {
    console.log("New WebSocket connection - " + new Date);

    socket.on("joinChatRoom", (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options });
        if (error) {
            return callback(error);
        } else {
            socket.join(user.room);
            callback();
        }
    });


    socket.on("joinOnlineUsers", (user, callback) => {
        console.log('joinOnlineUsers', user);
        socket.join(user);
        // io.to(user).emit("joinedOnlineUsers", user);
        /* socket.emit("message", generateMessage("Admin", "Welcome!"));
        socket.broadcast.to(user.room).emit("message", generateMessage("Admin", `${user.username} has joined!`));
        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room)
        }); */

        callback();
    });

    socket.on("eventTrgiggered", (options, callback) => {

        console.log('eventTrgiggered', options);
        socket.broadcast.to(options.to).emit(options.event, options.data);

        /* socket.emit("message", generateMessage("Admin", "Welcome!"));
        socket.broadcast.to(user.room).emit("message", generateMessage("Admin", `${user.username} has joined!`));
        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room)
        }); */

        callback();
    });

    socket.on("sendChatMessage", (data, callback) => {
        // const user = getUser(socket.id);
        // const filter = new Filter();
        console.log('sendChatMessage', data);

        // if (user == undefined) {
        //     socket.emit("rejoin", message);
        //     return;
        // }

        // if (message.type == '1' && filter.isProfane(message.text)) {
        //     return callback("Profanity is not allowed!");
        // } else {
        socket.broadcast.to(data.room).emit("newMessage", data);
        // io.to(user.room).emit("message", generateMessage(user.username, message.message, message.type));
        callback();
        // }
    });

    /*     socket.on("sendLocation", (coords, callback) => {
            const user = getUser(socket.id);
            io.to(user.room).emit("locationMessage", generateLocationMessage(user.username, `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`));
            callback();
        }); */


    socket.on("leaveChatRoom", (data) => {
        socket.leave(data.room);
        console.log('room_leaved', data);
        // if (user) {
        //     // io.to(user.room).emit("message", generateMessage("Admin", `${user.username} has left!`));
        //     io.to(user.room).emit("roomData", {
        //         room: user.room,
        //         users: getUsersInRoom(user.room)
        //     });
        // }
    });

    socket.on("disconnect", () => {
        const user = removeUser(socket.id);

        if (user) {
            // io.to(user.room).emit("message", generateMessage("Admin", `${user.username} has left!`));
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});