import { UI } from "./config.js";
import { players, getMe } from "./world.js";
import { totalMass } from "./gameplay.js";

export function updateHUD() {
    const me = getMe();
    if (me) me.score = Math.floor(totalMass(me));
    UI.scoreEl.textContent = me ? `Score: ${me.score}` : "Score: -";

    const top = [...players.values()]
        .filter(p => p.alive)
        .sort((a, b) => totalMass(b) - totalMass(a))
        .slice(0, 10);

    UI.lbEl.innerHTML = top
        .map((p, i) => `${i + 1}. ${p.name || "(no name)"} (${Math.floor(totalMass(p))})`)
        .join("<br>");
}

UI.selectedColor = "#6ae388";
UI.selectedBorderColor = "#ffffff";

document.addEventListener("DOMContentLoaded", () => {
    const cellColorCircles = document.querySelectorAll("#cellColorOptions .color-circle");
    const cellCustomCircle = document.getElementById("cellCustomCircle");
    const cellCustomColorInput = document.getElementById("cellCustomColor");
    const cellSelectedColorDisplay = document.getElementById("cellSelectedColorDisplay");

    function updateSelectedCellColor(color) {
        UI.selectedColor = color;
        cellSelectedColorDisplay.style.background = color;
    }

    cellColorCircles.forEach(circle => {
        if (circle === cellCustomCircle) return;
        circle.addEventListener("click", () => {
            cellColorCircles.forEach(c => c.classList.remove("selected"));
            circle.classList.add("selected");
            updateSelectedCellColor(circle.dataset.color);
        });
    });

    cellCustomCircle.addEventListener("click", () => cellCustomColorInput.click());

    cellCustomColorInput.addEventListener("input", e => {
        cellColorCircles.forEach(c => c.classList.remove("selected"));
        cellCustomCircle.classList.add("selected");
        updateSelectedCellColor(e.target.value);
    });

    const borderColorCircles = document.querySelectorAll("#borderColorOptions .color-circle");
    const borderCustomCircle = document.getElementById("borderCustomCircle");
    const borderCustomColorInput = document.getElementById("borderCustomColor");
    const borderSelectedColorDisplay = document.getElementById("borderSelectedColorDisplay");

    function updateSelectedBorderColor(color) {
        UI.selectedBorderColor = color;
        borderSelectedColorDisplay.style.background = color;
    }

    borderColorCircles.forEach(circle => {
        if (circle === borderCustomCircle) return;
        circle.addEventListener("click", () => {
            borderColorCircles.forEach(c => c.classList.remove("selected"));
            circle.classList.add("selected");
            updateSelectedBorderColor(circle.dataset.color);
        });
    });

    borderCustomCircle.addEventListener("click", () => borderCustomColorInput.click());

    borderCustomColorInput.addEventListener("input", e => {
        borderColorCircles.forEach(c => c.classList.remove("selected"));
        borderCustomCircle.classList.add("selected");
        updateSelectedBorderColor(e.target.value);
    });
});