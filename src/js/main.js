import { world, UI } from "./config.js";
import { populate, makePlayer } from "./entities.js";
import { botName } from "./gameplay.js";
import { tick } from "./loop.js";

populate();

const qtdBots = Math.min(world.bots, 20);
const nomesBots = botName(qtdBots);
for (let i = 0; i < qtdBots; i++) makePlayer(nomesBots[i], true);

requestAnimationFrame(tick);
