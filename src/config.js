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
    pausedEl: document.getElementById("paused"),
    playBtn: document.getElementById("play"),
    nameInput: document.getElementById("name"),
};

UI.pausedEl.classList.add("hidden");

export const world = {
    w: 6000,
    h: 6000,
    foodCount: 1500,
    virusCount: 30,
    bots: 25,
};

// helpers
export const rand = (a, b) => Math.random() * (b - a) + a;
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const dist2 = (a, b) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
};
