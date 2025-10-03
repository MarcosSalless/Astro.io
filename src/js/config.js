export const TAU = Math.PI * 2;

export const canvas = document.getElementById("game");
export const ctx = canvas.getContext("2d");

export let W = (canvas.width = window.innerWidth);
export let H = (canvas.height = window.innerHeight);

window.addEventListener("resize", () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
});

export const UI = {
    scoreEl: document.getElementById("score"),
    fpsEl: document.getElementById("fps"),
    lbEl: document.getElementById("leaderboard"),
    joinEl: document.getElementById("join"),
    playBtn: document.getElementById("play"),
    nameInput: document.getElementById("name"),
};

export const world = {
    w: parseInt(import.meta.env.VITE_WORLD_W),
    h: parseInt(import.meta.env.VITE_WORLD_H),
    foodCount: parseInt(import.meta.env.VITE_WORLD_FOOD),
    virusCount: parseInt(import.meta.env.VITE_WORLD_VIRUS),
    bots: parseInt(import.meta.env.VITE_WORLD_BOTS),
};

// helpers
export const rand = (a, b) => Math.random() * (b - a) + a;
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const dist2 = (a, b) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
};
