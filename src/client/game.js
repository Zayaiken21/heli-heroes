// src/client/game.js
import { HelicopterScene } from "./scenes/HelicopterScene.js";

const config = {
  type: Phaser.AUTO,
  parent: "body",
  width: 800,
  height: 600,
  physics: { default: "arcade", arcade: { gravity: { y: 0 } } },
  scene: [HelicopterScene],
  backgroundColor: "#1a1a1a"
};

export const game = new Phaser.Game(config);
