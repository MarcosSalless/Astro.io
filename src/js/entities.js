import { world, rand } from "./config.js";
import { foods, viruses, players, getNextId } from "./world.js";

export function makeFood() {
    const id = getNextId();
    foods.set(id, {
        id,
        x: rand(0, world.w),
        y: rand(0, world.h),
        r: rand(2.2, 3.8),
        color: `hsl(${Math.floor(rand(0, 360))} 90% 65%)`,
    });
}

export function makeVirus() {
    const id = getNextId();
    viruses.set(id, {
        id,
        x: rand(0, world.w),
        y: rand(0, world.h),
        r: 30 + rand(-4, 4),
    });
}

export function makePlayer(name, isBot = false) {
    const id = getNextId();
    const p = {
        id,
        name,
        isBot,
        color: isBot ? `hsl(${Math.floor(rand(0, 360))} 65% 55%)` : "#6ae388",
        cells: [],
        score: 0,
        alive: true,
        target: { x: rand(0, world.w), y: rand(0, world.h) },
        mergeCooldown: 0,
    };
    p.cells.push({
        id: getNextId(),
        x: rand(world.w * 0.25, world.w * 0.75),
        y: rand(world.h * 0.25, world.h * 0.75),
        r: 25,
        vx: 0,
        vy: 0,
    });
    players.set(id, p);
    return p;
}

export function populate() {
    foods.clear();
    viruses.clear();
    players.clear();
    for (let i = 0; i < world.foodCount; i++) makeFood();
    for (let i = 0; i < world.virusCount; i++) makeVirus();
}
