# Astro.io
College Assignment

## Description
Astro.io is a browser-based game inspired by Agar.io, developed as a college project. The player controls a cell in a space-themed environment, competing against AI-controlled bots. The goal is to grow by consuming food, ejecting mass, and defeating other cells.

## Features
- Player cell follows the mouse pointer
- Cell splitting (Spacebar) and mass ejection (W)
- Collision detection with other cells and viruses
- Food and virus entities scattered throughout the map
- AI-controlled bots with random movement
- Real-time leaderboard displaying top players
- Dynamic camera zoom based on player size
- Responsive HUD showing score and FPS

## Technologies
- HTML5 Canvas
- JavaScript (ES6)
- CSS3

## How to Play
1. Open the game in a browser.
2. Enter your name and click "Play".
3. Move your cell with the mouse.
4. Press **Spacebar** to split your cell.
5. Press **W** to eject mass.
6. Avoid viruses and larger cells, and try to grow bigger than the bots.

## Setup
No installation required. Simply open `index.html` in a modern browser to play.

## Project Structure

```
astro.io/
├─ index.html
└─ src/
   ├─ assets/
   │  ├─ css/
   │  │  └─ style.css
   │  └─ img/
   │     └─ ...
   └─ js/
      ├─ collision.js
      ├─ config.js
      ├─ controls.js
      ├─ entities.js
      ├─ gameplay.js
      ├─ hud.js
      ├─ loop.js
      ├─ main.js
      ├─ render.js
      └─ world.js
```
