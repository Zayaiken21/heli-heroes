// src/client/controls.js
export function setupControls(scene, heli) {
  // Desktop – arrow keys / WASD
  const cursors = scene.input.keyboard.createCursorKeys();
  const wasd = scene.input.keyboard.addKeys({
    up: "W", left: "A", down: "S", right: "D"
  });

  // Mobile – touch zones (left/right halves)
  const leftZone = scene.add.zone(0, 0, scene.scale.width / 2, scene.scale.height)
    .setOrigin(0).setInteractive();
  const rightZone = scene.add.zone(scene.scale.width / 2, 0,
    scene.scale.width / 2, scene.scale.height).setOrigin(0).setInteractive();

  leftZone.on("pointerdown", () => heli.setVelocityX(-200));
  leftZone.on("pointerup", () => heli.setVelocityX(0));

  rightZone.on("pointerdown", () => heli.setVelocityX(200));
  rightZone.on("pointerup", () => heli.setVelocityX(0));

  // Up‑thrust (tap anywhere)
  scene.input.on("pointerdown", (p) => {
    if (p.y < scene.scale.height * 0.8) heli.setVelocityY(-300);
  });
  scene.input.on("pointerup", () => heli.setVelocityY(0));

  // Keyboard handling
  scene.events.on("update", () => {
    const left = cursors.left.isDown || wasd.left.isDown;
    const right = cursors.right.isDown || wasd.right.isDown;
    const up = cursors.up.isDown || wasd.up.isDown;

    if (left) heli.setVelocityX(-200);
    else if (right) heli.setVelocityX(200);
    else heli.setVelocityX(0);

    if (up) heli.setVelocityY(-300);
  });
}
