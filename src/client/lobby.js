// src/client/lobby.js
const socket = io();

document.getElementById("hostBtn").addEventListener("click", () => {
  const levelId = prompt("Pick a level (0‑99)", "0");
  socket.emit("hostGame", { levelId });
});

document.getElementById("joinBtn").addEventListener("click", () => {
  // UI will fill `rooms` div with clickable rows
});

socket.on("roomList", (rooms) => {
  const container = document.getElementById("rooms");
  container.innerHTML = "";
  rooms.forEach(r => {
    const el = document.createElement("div");
    el.className = "room";
    el.textContent = `🕹️ ${r.roomId.slice(0, 8)} – Level ${r.levelId} – ${r.playerCount} player(s)`;
    el.onclick = () => socket.emit("joinGame", { roomId: r.roomId });
    container.appendChild(el);
  });
});

socket.on("joined", ({ roomId, levelId }) => {
  // Kick off Phaser with the correct level ID
  import("./game.js").then(({ game }) => {
    game.scene.start("HelicopterScene", { levelId });
  });
});
