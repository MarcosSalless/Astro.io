import { world } from "./config.js";

export const camera = { x: world.w / 2, y: world.h / 2, z: 1, targetZ: 1 };

export const foods = new Map();
export const viruses = new Map();
export const players = new Map();

export let idSeq = 1;
let me = null;

export function getNextId() {
  return idSeq++;
}

export function setMe(p) { me = p; }
export function getMe() { return me; }

