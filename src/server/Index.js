// src/server/index.js
import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { LobbyManager } from "./lobbyManager.js";

const app = express();
app.use(express.static("public")); // serve HTML/CSS/JS

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

const lobby = new LobbyManager(io);

io.on("connection", (socket) => {
  console.log("🔌 client connected:", socket.id);
  lobby.register(socket);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));
