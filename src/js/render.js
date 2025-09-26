import { ctx, W, H, TAU, world } from "./config.js";
import { foods, viruses, players, camera } from "./world.js";

const virusImg = new Image();
virusImg.src = "src/assets/img/virus1.png";
let virusReady = false;
virusImg.onload = () => { virusReady = true; };

export function draw() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.scale(camera.z, camera.z);
    ctx.translate(-camera.x, -camera.y);

    // grade de back
    ctx.strokeStyle = "#333";
    for (let x = 0; x < world.w; x += 100) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, world.h);
        ctx.stroke();
    }
    for (let y = 0; y < world.h; y += 100) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(world.w, y);
        ctx.stroke();
    }

    // foooooooooods
    for (const f of foods.values()) {
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, TAU);
        ctx.fill();
    }

    // virus 
    if (virusReady) {
        for (const v of viruses.values()) {
            if (!("angle" in v)) v.angle = 0; 
            v.angle += 0.005;

            ctx.save();
            ctx.translate(v.x, v.y);
            ctx.rotate(v.angle);
            ctx.drawImage(virusImg, -v.r, -v.r, v.r * 2, v.r * 2);
            ctx.restore();
        }
    }

    // palyers
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
