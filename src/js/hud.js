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

// cor de las bolotas
UI.selectedColor = "#6ae388";

const colorCircles = document.querySelectorAll(".color-circle");
const customCircle = document.getElementById("customCircle");
const customColorInput = document.getElementById("customColor");
const selectedColorDisplay = document.getElementById("selectedColorDisplay");

function updateSelectedColor(color) {
    UI.selectedColor = color;
    selectedColorDisplay.style.background = color;
}

colorCircles.forEach(circle => {
    if (circle === customCircle) return;

    circle.addEventListener("click", () => {
        colorCircles.forEach(c => c.classList.remove("selected"));
        circle.classList.add("selected");
        updateSelectedColor(circle.dataset.color);
    });
});

// picker das bolota
customCircle.addEventListener("click", () => customColorInput.click());

// picker custom das bola 
customColorInput.addEventListener("input", e => {
    colorCircles.forEach(c => c.classList.remove("selected"));
    customCircle.classList.add("selected");
    updateSelectedColor(e.target.value);
});
