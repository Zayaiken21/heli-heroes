// src/server/lobbyManager.js
import { v4 as uuidv4 } from "uuid";

export class LobbyManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map(); // roomId → { hostId, levelId, players:Set }
    this.cleanupInterval = setInterval(() => this.pruneEmptyRooms(), 30_000);
  }

  register(socket) {
    // Send current room list to the newly‑connected client
    socket.emit("roomList", this.serializeRooms());

    // ---------- Host a new game ----------
    socket.on("hostGame", ({ levelId }) => {
      const roomId = uuidv4();
      this.rooms.set(roomId, {
        hostId: socket.id,
        levelId,
        players: new Set([socket.id])
      });
      socket.join(roomId);
      this.io.emit("roomList", this.serializeRooms());
    });

    // ---------- Join an existing room ----------
    socket.on("joinGame", ({ roomId }) => {
      const room = this.rooms.get(roomId);
      if (!room) return socket.emit("errorMsg", "Room not found");
      room.players.add(socket.id);
      socket.join(roomId);
      socket.emit("joined", { roomId, levelId: room.levelId });
      // Optional: notify the host that a new peer arrived
      this.io.to(room.hostId).emit("peerJoined", { peerId: socket.id });
    });

    // ---------- Clean up on disconnect ----------
    socket.on("disconnect", () => {
      for (const [id, room] of this.rooms.entries()) {
        if (room.players.delete(socket.id)) {
          if (room.players.size === 0) {
            this.rooms.delete(id);
          } else if (room.hostId === socket.id) {
            // Transfer host role to the first remaining player
            const newHost = [...room.players][0];
            room.hostId = newHost;
            this.io.to(newHost).emit("youAreHost");
          }
        }
      }
      this.io.emit("roomList", this.serializeRooms());
    });
  }

  // Helper – turn the Map into an array that the client can display
  serializeRooms() {
    return [...this.rooms.entries()].map(([id, r]) => ({
      roomId: id,
      hostId: r.hostId,
      levelId: r.levelId,
      playerCount: r.players.size
    }));
  }

  // Periodic cleanup of any rooms that somehow became empty
  pruneEmptyRooms() {
    for (const [id, room] of this.rooms.entries()) {
      if (room.players.size === 0) this.rooms.delete(id);
    }
  }
}
