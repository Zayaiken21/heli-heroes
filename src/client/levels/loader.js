// src/client/levels/loader.js
export async function loadLevel(scene, levelId) {
  const resp = await fetch(`/client/levels/level-${levelId}.json`);
  const data = await resp.json();

  // create static physics bodies from `terrain`
  data.terrain.forEach(t => {
    const rect = scene.add.rectangle(t.x, t.y, t.w, t.h, 0x555555).setOrigin(0);
    scene.physics.add.existing(rect, true); // static body
    scene.physics.add.collider(scene.heli, rect);
  });

  // add collectibles, goal, etc.
  // …
}
