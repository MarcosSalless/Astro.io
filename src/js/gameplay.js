import { world, clamp, UI } from "./config.js";
import { camera, getMe, setMe, getNextId, foods, players } from "./world.js";
import { makePlayer, createVertices } from "./entities.js";
import { mouse } from "./controls.js";

export function botName(quantidade) {
    const nomes = [];
    const limite = Math.min(quantidade, 20);
    for (let i = 1; i <= limite; i++) nomes.push("bot " + i);
    return nomes;
}

export function start(name) {
    if (getMe() && getMe().alive) return;

    UI.joinEl.style.display = "none";

    const me = makePlayer(name, false, UI.selectedColor, UI.selectedBorderColor);

    const pos = getSafePosition(me.cells[0].r);
    me.cells[0].x = pos.x;
    me.cells[0].y = pos.y;

    setMe(me);
}

export const massFromR = (r) => r * r;
export const rFromMass = (m) => Math.sqrt(m);

export function movePlayer(p, dt) {
    for (const c of p.cells) {
        let tx, ty;
        let factor = 1;

        if (p === getMe()) {
            console.log("MergeCooldown:", p.mergeCooldown.toFixed(3), "dt:", dt.toFixed(3));
            tx = (mouse.x - window.innerWidth / 2) / camera.z + camera.x;
            ty = (mouse.y - window.innerHeight / 2) / camera.z + camera.y;

            const dx = tx - c.x;
            const dy = ty - c.y;
            const dist = Math.hypot(dx, dy);

            const maxDist = 100;
            const minFactor = 0.2;
            const maxFactor = 1.5;
            factor = Math.min(maxFactor, Math.max(minFactor, dist / maxDist));

            const ang = Math.atan2(dy, dx);
            const baseSpeed = 10000;
            const sizeFactor = 1 / (c.r * 0.008 + 1);
            const speed = (baseSpeed * sizeFactor + 200) * factor;

            c.vx += Math.cos(ang) * speed * dt;
            c.vy += Math.sin(ang) * speed * dt;

        } else if (p.isBot) {
            if (Math.random() < 0.01) {
                p.target.x = clamp(p.target.x + (Math.random() - 0.5) * 800, 0, world.w);
                p.target.y = clamp(p.target.y + (Math.random() - 0.5) * 800, 0, world.h);
            }
            tx = p.target.x; ty = p.target.y;
            const ang = Math.atan2(ty - c.y, tx - c.x);
            const baseSpeed = 10000;
            const sizeFactor = 1 / (c.r * 0.008 + 1);
            const speed = baseSpeed * sizeFactor + 200;
            c.vx += Math.cos(ang) * speed * dt;
            c.vy += Math.sin(ang) * speed * dt;
        }

        const damping = 0.85;
        c.vx *= damping;
        c.vy *= damping;

        c.x += c.vx * dt;
        c.y += c.vy * dt;

        const baseStiffness = 0.8;
        const vertexDamping = 0.9;
        const referenceRadius = 50;
        for (const v of c.vertices) {
            v.x = clamp(v.x, 0, world.w);
            v.y = clamp(v.y, 0, world.h);

            v.r += (c.r - v.r) * 0.8 * (referenceRadius / c.r);

            const targetX = c.x + Math.cos(v.angle) * v.r;
            const targetY = c.y + Math.sin(v.angle) * v.r;

            const stiffness = baseStiffness * (referenceRadius / c.r);
            v.vx += (targetX - v.x) * stiffness;
            v.vy += (targetY - v.y) * stiffness;

            v.x += v.vx * dt;
            v.y += v.vy * dt;

            v.vx *= vertexDamping;
            v.vy *= vertexDamping;

            if (v.x < 0) v.vx += (0 - v.x) * 0.5;
            if (v.x > world.w) v.vx += (world.w - v.x) * 0.5;
            if (v.y < 0) v.vy += (0 - v.y) * 0.5;
            if (v.y > world.h) v.vy += (world.h - v.y) * 0.5;
        }

        c.x = c.vertices.reduce((sum, v) => sum + v.x, 0) / c.vertices.length;
        c.y = c.vertices.reduce((sum, v) => sum + v.y, 0) / c.vertices.length;

        const pad = c.r;
        c.x = clamp(c.x, pad, world.w - pad);
        c.y = clamp(c.y, pad, world.h - pad);
    }

    if (p.mergeCooldown > 0) {
        p.mergeCooldown -= dt;
        for (let i = 0; i < p.cells.length; i++) {
            for (let j = i + 1; j < p.cells.length; j++) {
                const a = p.cells[i];
                const b = p.cells[j];
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const d = Math.hypot(dx, dy);
                const minDist = a.r + b.r;
                if (d < minDist && d > 0.01) {
                    const overlap = (minDist - d) / d;
                    const fx = dx * overlap * 0.5;
                    const fy = dy * overlap * 0.5;

                    const maxPushX = Math.min(Math.abs(fx), a.r * 0.5);
                    const maxPushY = Math.min(Math.abs(fy), a.r * 0.5);

                    a.x -= Math.sign(fx) * maxPushX;
                    a.y -= Math.sign(fy) * maxPushY;
                    b.x += Math.sign(fx) * maxPushX;
                    b.y += Math.sign(fy) * maxPushY;
                }
            }
        }
    } else {
        const now = performance.now();
        for (let i = 0; i < p.cells.length; i++) {
            for (let j = i + 1; j < p.cells.length; j++) {
                const a = p.cells[i];
                const b = p.cells[j];

                const minAge = 500; // milliseconds
                if ((now - (a.createdAt || 0)) < minAge || (now - (b.createdAt || 0)) < minAge) {
                    continue;
                }

                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const d = Math.hypot(dx, dy);

                if (d < Math.min(a.r, b.r)) {
                    const totalMassValue = massFromR(a.r) + massFromR(b.r);
                    a.r = rFromMass(totalMassValue);
                    a.vx = (a.vx + b.vx) * 0.5;
                    a.vy = (a.vy + b.vy) * 0.5;
                    a.vertices = createVertices(a);
                    p.cells.splice(j, 1);
                    j--;
                }
            }
        }
    }
}
export function totalMass(p) {
    return p.cells.reduce((s, c) => s + massFromR(c.r), 0);
}

export function split(p) {
    const maxCells = 16;
    const cellsToSplit = [];
    for (const c of p.cells) {
        if (massFromR(c.r) >= 200 && p.cells.length + cellsToSplit.length < maxCells) {
            cellsToSplit.push(c);
        }
    }

    for (const c of cellsToSplit) {
        const oldMass = massFromR(c.r);
        const newMass = oldMass / 2;

        c.r = rFromMass(newMass);
        c.createdAt = performance.now()

        const tx = (mouse.x - window.innerWidth / 2) / camera.z + camera.x;
        const ty = (mouse.y - window.innerHeight / 2) / camera.z + camera.y;
        const ang = Math.atan2(ty - c.y, tx - c.x);

        const launchDist = c.r * 2;
        const launchSpeed = 800;

        const newCell = {
            id: getNextId(),
            x: c.x + Math.cos(ang) * launchDist,
            y: c.y + Math.sin(ang) * launchDist,
            r: rFromMass(newMass),
            vx: Math.cos(ang) * launchSpeed,
            vy: Math.sin(ang) * launchSpeed,
            color: p.color,
            borderColor: p.borderColor,
            createdAt: performance.now(),
            vertices: createVertices({ x: c.x + Math.cos(ang) * launchDist, y: c.y + Math.sin(ang) * launchDist, r: rFromMass(newMass) })
        };

        p.cells.push(newCell);
    }

    const m = totalMass(p);
    p.mergeCooldown = Math.max(3, Math.min(19, 3 + m / 500));
    console.log("Split! Merge cooldown setado para:", p.mergeCooldown);
}

export function eject(p) {
    const rMin = 20;
    const ejectMass = 30;

    for (const c of p.cells) {
        const cellMass = massFromR(c.r);
        if (cellMass <= ejectMass + rMin * rMin) continue;

        const newMass = cellMass - ejectMass;
        c.r = rFromMass(newMass);

        const angle = Math.atan2(
            mouse.y - window.innerHeight / 2,
            mouse.x - window.innerWidth / 2
        );

        const id = getNextId();

        const newFood = {
            id,
            x: c.x + Math.cos(angle) * (c.r + 5),
            y: c.y + Math.sin(angle) * (c.r + 5),
            r: rFromMass(ejectMass),
            color: "#ff6666",
            isEjected: true,
            mass: ejectMass,
            vx: Math.cos(angle) * 600,
            vy: Math.sin(angle) * 600,
            vertices: createVertices({ x: c.x, y: c.y, r: rFromMass(ejectMass) })
        };

        foods.set(id, newFood);
    }
}

let gameOverTimeout = null;

export function getSafePosition(radius) {
    let tries = 0;
    while (tries < 200) {
        const x = Math.random() * world.w;
        const y = Math.random() * world.h;
        let safe = true;

        for (const p of players.values()) {
            for (const c of p.cells) {
                const dx = c.x - x;
                const dy = c.y - y;
                if (Math.hypot(dx, dy) < c.r + radius + 100) {
                    safe = false;
                    break;
                }
            }
            if (!safe) break;
        }

        if (safe) return { x, y };
        tries++;
    }

    return { x: Math.random() * world.w, y: Math.random() * world.h };
}

export function respawnBots(now) {
    const toRespawn = [];

    for (const [id, p] of players.entries()) {
        if (p.isBot && !p.alive && p.respawnAt && p.respawnAt <= now) {
            toRespawn.push({ id, name: p.name, color: p.color });
        }
    }

    for (const info of toRespawn) {
        players.delete(info.id);

        const newBot = makePlayer(
            info.name,
            true,
            info.color,
            info.borderColor || "#ffffff"
        );

        const pos = getSafePosition(newBot.cells[0].r);
        newBot.cells[0].x = pos.x;
        newBot.cells[0].y = pos.y;

        newBot.alive = true;
        newBot.mergeCooldown = 2;

        players.set(newBot.id, newBot);
    }
}

export function gameOver() {
    const me = getMe();
    if (!me) return;

    me.alive = false;
    me.cells = [];

    players.delete(me.id);

    UI.joinEl.style.display = "flex";

    if (gameOverTimeout) clearTimeout(gameOverTimeout);

    setMe(null);
    gameOverTimeout = null;
}