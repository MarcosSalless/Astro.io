import { foods, viruses, players } from "./world.js";
import { makeFood, makeVirus, createVertices } from "./entities.js";
import { split, massFromR, rFromMass } from "./gameplay.js";

export function handleCollisions() {
    const cellsToUpdate = new Map(); // Armazena células que precisam atualizar vértices
    
    // Colisão com comida
    for (const f of [...foods.values()]) {
        let wasEaten = false;
        for (const p of players.values()) {
            if (!p.alive || wasEaten) continue;
            
            for (const c of p.cells) {
                const d = Math.hypot(f.x - c.x, f.y - c.y);
                if (d < c.r) {
                    const gainMass = f.isEjected ? f.mass * 0.8 : massFromR(f.r);
                    c.r = rFromMass(massFromR(c.r) + gainMass);
                    
                    cellsToUpdate.set(c.id, c);
                    
                    foods.delete(f.id);
                    if (!f.isEjected) makeFood();
                    wasEaten = true;
                    break;
                }
            }
        }
    }

    // Colisão com vírus
    for (const v of [...viruses.values()]) {
        let triggered = false;
        for (const p of players.values()) {
            if (!p.alive || triggered) continue;
            
            for (const c of p.cells) {
                if (Math.hypot(v.x - c.x, v.y - c.y) < c.r - 10) {
                    split(p);
                    viruses.delete(v.id);
                    makeVirus();
                    triggered = true;
                    break;
                }
            }
        }
    }

    // Colisão entre jogadores
    const cellsToRemove = [];
    
    for (const p of players.values()) {
        if (!p.alive) continue;
        
        for (const q of players.values()) {
            if (p === q || !q.alive) continue;
            
            for (const c of p.cells) {
                for (const d of q.cells) {
                    const dist = Math.hypot(c.x - d.x, c.y - d.y);
                    
                    if (dist < c.r && c.r > d.r * 1.15) {
                        c.r = rFromMass(massFromR(c.r) + massFromR(d.r));
                        cellsToUpdate.set(c.id, c);
                        cellsToRemove.push({ player: q, cell: d });
                    }
                }
            }
        }
    }
    
    for (const { player, cell } of cellsToRemove) {
        const index = player.cells.indexOf(cell);
        if (index !== -1) {
            player.cells.splice(index, 1);
        }
        
        if (player.cells.length === 0) {
            player.alive = false;
            if (player.isBot && !player.respawnAt) {
                player.respawnAt = performance.now() + 1500;
            }
        }
    }
    
    for (const cell of cellsToUpdate.values()) {
        cell.vertices = createVertices(cell);
    }
}