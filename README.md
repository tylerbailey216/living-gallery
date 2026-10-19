# The Living Gallery — VS Code / Codex Edition

This project is a refactor of the existing **Living Gallery — iPhone Edition** prototype. It preserves the original UI, interactions, and embedded artwork while splitting them into editable source files.

## Run on Windows 11

1. Extract this ZIP, then open the folder in VS Code (`File > Open Folder`).
2. Open the integrated terminal (`Ctrl+` `).
3. Run `py -m http.server 8000` (or `python -m http.server 8000`).
4. On your PC, open `http://localhost:8000`.

## Test on iPhone 14

For reliable testing, publish to GitHub Pages using **Settings > Pages > Deploy from a branch > main > / (root)**. Open the published HTTPS URL in Safari. Local-network HTTP may work for basic testing but cannot provide the secure context required for camera-based AR and some device APIs.

## Project layout

- `index.html` — HTML markup
- `css/styles.css` — appearance, mobile layout, hotspot styling
- `js/app.js` — interactions, motion, particles, sound
- `assets/gallery.png` — original generated room artwork
- `AGENTS.md` — Codex development guidance
- `.gitignore` — common editor/system exclusions

## Current capabilities

The existing experience is a **2D interactive AR-style simulation**, not live camera-based augmented reality. It has an awaken/reset action, particles, touch/motion interactions, audio, and interactive hotspots. It does not currently use MindAR, WebXR, or camera tracking.

## Suggested next steps

1. Test all buttons and hotspots in desktop browsers and iPhone Safari.
2. Fix iOS touch event propagation, audio unlock, and motion permission handling.
3. Refactor JavaScript into small modules with a central state controller.
4. Add accessible controls and reduced-motion support.
5. In a separate feature branch, prototype MindAR image-target tracking using the physical painting as target.

Do not assume a static scene is genuine AR. Keep the existing demo working while adding new features.
