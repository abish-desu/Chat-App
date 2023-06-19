const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const roomPinMap = new Map();

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on("join_room", (room) => {
    console.log(room)
    if (roomPinMap.has(room)) {
      socket.join(room);
      socket.room = room;
      } else {
        console.log(room)
      socket.emit("no_room_found", room);
    }
  });
  socket.on("create_room", (roomPin) => {
   roomPinMap.set(roomPin)
    socket.join(roomPin);

  });

  socket.on("send_msg", (data) => {
    const { room, msg } = data;
    socket.to(room).emit("receive_msg", {  message: msg });
  });

  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.id}`);
    if (socket.room) {
      socket.leave(socket.room);
      console.log(`User ${socket.id} left room ${socket.room}`);
    }
  });
});

server.listen(3001, () => {
  console.log("server is running");
});
