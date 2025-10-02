let devMode = true;

import * as mainConfig from './environments/config.main.js';
import * as devConfig from './environments/config.dev.js';

export const world = devMode ? devConfig.world : mainConfig.world;
export const TAU = devMode ? devConfig.TAU : mainConfig.TAU;
export const canvas = devMode ? devConfig.canvas : mainConfig.canvas;
export const ctx = devMode ? devConfig.ctx : mainConfig.ctx;
export let W = devMode ? devConfig.W : mainConfig.W;
export let H = devMode ? devConfig.H : mainConfig.H;
export const UI = devMode ? devConfig.UI : mainConfig.UI;
export const rand = devMode ? devConfig.rand : mainConfig.rand;
export const clamp = devMode ? devConfig.clamp : mainConfig.clamp;
export const dist2 = devMode ? devConfig.dist2 : mainConfig.dist2;
