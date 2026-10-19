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

## Interaction verification after the stability update

The gallery keeps its original artwork and simulated AR behavior. Motion is now a toggle; Reset also stops motion/audio and recenters the scene. Reduced-motion preferences disable scene movement and animated effects. Background tabs pause particle rendering and stop sound.

Desktop and iPhone Safari checks:

1. Tap Awaken, then open and close each hotspot. Guitar should play a short synthesized sequence if audio is available.
2. Reset and awaken again. Check that the scene recenters and motion is disabled.
3. Swipe/drag the scene, then tap controls and panel text. Buttons should still respond normally.
4. Enable motion from its button, accept permission if prompted, then disable it. Test denied permission too.
5. Open a hotspot with the keyboard: focus should move to Close, Tab should stay in the dialog, and Escape should return focus to the hotspot.
6. Toggle fullscreen where supported. If unavailable, check the fallback message.
7. Enable the device's Reduce Motion setting: particles, pulsing, glow animation, and scene movement should stop.
8. Check portrait and landscape layouts, safe areas, and pinch zoom. Switch away and back to check that animation resumes only when appropriate.

Local automated checks cover JavaScript syntax and mocked interaction state transitions. Actual Safari audio, sensor permissions, gestures, and visual layout still require device testing.
