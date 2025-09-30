import { W, H, UI } from "./config.js";
import { split, eject, start } from "./gameplay.js";
import { getMe } from "./world.js";

export const mouse = { x: W / 2, y: H / 2 };

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

UI.playBtn.addEventListener("click", () => {
    const nm = (UI.nameInput.value || "Jogador").trim().slice(0, 16);
    start(nm);
});

UI.nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") UI.playBtn.click();
});

window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "w") {
        const me = getMe();
        if (me && me.alive && me.cells.length > 0) {
            eject(me);
        }
    }
});

window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        const me = getMe();
        if (me && me.alive && me.cells.length > 0) {
            split(me);
        }
    }
});