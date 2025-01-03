const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'https://video-chat-l94mbbjfp-rishabh-shrivals-projects.vercel.app/', // Your Vercel frontend URL
    methods: ['GET', 'POST']
  }
});

let users = []; // List of connected users

app.use(express.static("public")); // Serve the frontend files

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  users.push(socket.id);

  // Send updated user list to all clients
  io.emit("user-list", users);

  // Handle signaling data
  socket.on("signal", (data) => {
    const { to, signal } = data;
    io.to(to).emit("signal", { from: socket.id, signal });
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    users = users.filter((id) => id !== socket.id);
    io.emit("user-list", users); // Update user list
  });
});

server.listen(3000, () => {
  console.log("Server running at https://video-chat-l94mbbjfp-rishabh-shrivals-projects.vercel.app/");
});
