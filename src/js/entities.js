import { world, rand } from "./config.js";
import { foods, viruses, players, getNextId } from "./world.js";
import { massFromR, rFromMass, } from "./gameplay.js";

const botBorderColors = [
    "#ffffff", "#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24",
    "#6c5ce7", "#a29bfe", "#fd79a8", "#fdcb6e", "#00b894",
    "#00cec9", "#0984e3", "#6c5ce7", "#e17055", "#fab1a0",
    "#ff7675", "#74b9ff", "#a29bfe", "#55efc4", "#ffeaa7"
];

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
        r: 60 + rand(-4, 4),
        angle: rand(0, Math.PI * 2),
    });
}

let usedBorderColors = new Set();

export function makePlayer(name, isBot = false, chosenColor = null, borderColor = "#ffffff") {
    const id = getNextId();

    let finalBorderColor = borderColor;

    if (isBot) {
        const availableColors = botBorderColors.filter(c => !usedBorderColors.has(c));
        if (availableColors.length === 0) {
            usedBorderColors.clear();
            availableColors.push(...botBorderColors);
        }
        finalBorderColor = availableColors[Math.floor(Math.random() * availableColors.length)];
        usedBorderColors.add(finalBorderColor);
    }

    const p = {
        id,
        name,
        isBot,
        color: isBot ? `hsl(${Math.floor(rand(0, 360))} 65% 55%)` : (chosenColor || "#6ae388"),
        borderColor: finalBorderColor,
        cells: [],
        score: 0,
        alive: true,
        target: { x: rand(0, world.w), y: rand(0, world.h) },
        mergeCooldown: 0,
    };

    const baseR = 25;
    const cell = {
        id: getNextId(),
        x: rand(world.w * 0.25, world.w * 0.75),
        y: rand(world.h * 0.25, world.h * 0.75),
        r: baseR,
        vx: 0,
        vy: 0,
        color: p.color,
        borderColor: p.borderColor,
        vertices: []
    };

    const NUM_VERTICES = 32
    const angleStep = (Math.PI * 2) / NUM_VERTICES;

    for (let i = 0; i < NUM_VERTICES; i++) {
        const angle = i * angleStep;
        cell.vertices.push({
            angle,
            r: baseR,
            x: cell.x + Math.cos(angle) * baseR,
            y: cell.y + Math.sin(angle) * baseR,
            vx: 0,
            vy: 0
        });
    }

    p.cells.push(cell);
    players.set(id, p);
    return p;
}

export function createVertices(cell) {
    const NUM_VERTICES = 32
    const angleStep = (Math.PI * 2) / NUM_VERTICES;
    const vertices = [];
    for (let i = 0; i < NUM_VERTICES; i++) {
        const angle = i * angleStep;
        vertices.push({
            angle,
            r: cell.r,
            x: cell.x + Math.cos(angle) * cell.r,
            y: cell.y + Math.sin(angle) * cell.r,
            vx: 0,
            vy: 0
        });
    }
    return vertices;
}

export function populate() {
    foods.clear();
    viruses.clear();
    players.clear();
    for (let i = 0; i < world.foodCount; i++) makeFood();
    for (let i = 0; i < world.virusCount; i++) makeVirus();
}
