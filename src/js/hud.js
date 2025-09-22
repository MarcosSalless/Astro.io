import { UI } from "./config.js";
import { players, getMe } from "./world.js";
import { totalMass } from "./gameplay.js";

export function updateHUD() {
    const me = getMe();
    if (me) me.score = Math.floor(totalMass(me));
    UI.scoreEl.textContent = me ? `Score: ${me.score}` : "Score: -";

    const top = [...players.values()]
        .filter((p) => p.alive)
        .sort((a, b) => totalMass(b) - totalMass(a))
        .slice(0, 10);

    UI.lbEl.innerHTML = top
        .map((p, i) => `${i + 1}. ${p.name || "(no name)"} (${Math.floor(totalMass(p))})`)
        .join("<br>");
}
