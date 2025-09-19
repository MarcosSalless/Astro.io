import { players, camera, getMe, isPaused, foods } from "./world.js";
import { movePlayer } from "./gameplay.js";
import { handleCollisions } from "./collisions.js";
import { draw } from "./render.js";
import { updateHUD } from "./hud.js";
import { clamp } from "./config.js";

let last = performance.now();
let fpsCounter = 0;
let fpsTime = 0;

export function tick(now) {
    const dt = (now - last) / 1000;
    last = now;

    if (!isPaused()) {
        for (const p of players.values()) if (p.alive) movePlayer(p, dt);
        handleCollisions();

        for (const f of foods.values()) {
            if (f.isEjected) {
                f.x += f.vx * dt;
                f.y += f.vy * dt;
                f.vx *= 0.9;
                f.vy *= 0.9;
            }
        }
    }

    const me = getMe();
    if (me) {
        const mc = me.cells[0];
        if (mc) {
            camera.x += (mc.x - camera.x) * 0.1;
            camera.y += (mc.y - camera.y) * 0.1;
            camera.targetZ = clamp(1.5 - mc.r / 500, 0.3, 1.5);
            camera.z += (camera.targetZ - camera.z) * 0.1;
        }
    }

    draw();
    updateHUD(dt);

    fpsCounter++;
    fpsTime += dt;
    if (fpsTime >= 1) {
        document.getElementById("fps").textContent = `FPS: ${fpsCounter}`;
        fpsCounter = 0;
        fpsTime = 0;
    }

    requestAnimationFrame(tick);
}
