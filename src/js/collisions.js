import { foods, viruses, players } from "./world.js";
import { makeFood, makeVirus } from "./entities.js";
import { split, massFromR, rFromMass, totalMass } from "./gameplay.js";

export function handleCollisions() {
    for (const f of [...foods.values()]) {
        for (const p of players.values()) {
            for (const c of p.cells) {
                const d = Math.hypot(f.x - c.x, f.y - c.y);
                if (d < c.r) {
                    const gainMass = f.isEjected ? f.mass * 0.8 : massFromR(f.r);
                    c.r = rFromMass(massFromR(c.r) + gainMass);
                    foods.delete(f.id);
                    if (!f.isEjected) makeFood();
                }
            }
        }
    }

    for (const v of [...viruses.values()]) {
        for (const p of players.values()) {
            for (const c of p.cells) {
                if (Math.hypot(v.x - c.x, v.y - c.y) < c.r - 10) {
                    split(p);
                    viruses.delete(v.id);
                    makeVirus();
                }
            }
        }
    }

    for (const p of players.values()) {
        for (const q of players.values()) {
            if (p === q || !p.alive || !q.alive) continue;
            for (const c of p.cells) {
                for (const d of q.cells) {
                    if (Math.hypot(c.x - d.x, c.y - d.y) < c.r && c.r > d.r * 1.15) {
                        c.r = rFromMass(massFromR(c.r) + massFromR(d.r));
                        q.cells.splice(q.cells.indexOf(d), 1);
                        if (q.cells.length === 0) q.alive = false;
                    }
                }
            }
        }
    }
}
