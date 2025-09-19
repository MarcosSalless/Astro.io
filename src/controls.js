import { W, H, UI } from "./config.js";
import { setMe, getMe, isPaused, setPaused } from "./world.js";
import { split, eject, start } from "./gameplay.js";

export const mouse = { x: W / 2, y: H / 2 };

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener("keydown", (e) => {
    const me = getMe();
    if (!me) {
        if (e.key === "Escape") {
            setPaused(!isPaused());
            UI.pausedEl.classList.toggle("hidden", !isPaused());
        }
        return;
    }
    if (e.key === " ") split(me);
    if (e.key.toLowerCase() === "w") eject(me);
    if (e.key === "Escape") {
        setPaused(!isPaused());
        UI.pausedEl.classList.toggle("hidden", !isPaused());
    }
});

UI.playBtn.addEventListener("click", () => {
    const nm = (UI.nameInput.value || "Jogador").trim().slice(0, 16);
    start(nm);
});

UI.nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") UI.playBtn.click();
});
