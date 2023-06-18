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

const rooms = new Map();

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
    socket.room = room;
  });

  socket.on("send_msg", (data) => {
    const { room, msg } = data;
    socket.to(room).emit("receive_msg", { room, message: msg });
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
