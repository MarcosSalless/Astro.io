import { ctx, W, H, TAU, world } from "./config.js";
import { foods, viruses, players, camera } from "./world.js";

export function draw() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.scale(camera.z, camera.z);
    ctx.translate(-camera.x, -camera.y);

    ctx.strokeStyle = "#333";
    for (let x = 0; x < world.w; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, world.h);
        ctx.stroke();
    }
    for (let y = 0; y < world.h; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(world.w, y);
        ctx.stroke();
    }

    for (const f of foods.values()) {
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, TAU);
        ctx.fill();
    }

    ctx.fillStyle = "#33aa33";
    for (const v of viruses.values()) {
        ctx.beginPath();
        ctx.arc(v.x, v.y, v.r, 0, TAU);
        ctx.fill();
    }

    for (const p of players.values()) {
        if (!p.alive) continue;
        ctx.fillStyle = p.color;
        for (const c of p.cells) {
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.r, 0, TAU);
            ctx.fill();
        }
        const main = p.cells[0];
        if (main) {
            ctx.fillStyle = "#fff";
            ctx.font = `${Math.max(12, main.r * 0.5)}px sans-serif`;
            ctx.textAlign = "center";
            ctx.fillText(p.name, main.x, main.y + main.r + 20);
        }
    }
    ctx.restore();
}
