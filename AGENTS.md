# Codex Project Instructions — The Living Gallery

## Goal
Develop a responsive, polished interactive gallery for iPhone 14 Safari and desktop browsers, eventually supporting image-target augmented reality using MindAR and Three.js.

## Baseline
- Preserve existing layout, original artwork, visual identity, and interactions unless asked to change them.
- `index.html`, `css/styles.css`, `js/app.js`, and `assets/gallery.png` are the authoritative files.
- Existing prototype is an AR-style simulation; do not claim live AR is implemented.
- Prefer lightweight vanilla JavaScript; avoid frameworks or build tools unless they materially help.
- Do not replace the original art asset with a generated placeholder.

## Quality checks
- Verify button actions: Awaken/Reset, hotspots, close panel, fullscreen, and motion control.
- Check touch gestures on iOS Safari without preventing taps on buttons or panels.
- Request device orientation permission only in direct response to a user gesture when required.
- Unlock audio from user gestures; fail gracefully if audio is unavailable.
- Support safe areas, portrait/landscape orientation, and prefers-reduced-motion.
- Avoid horizontal overflow and excessive CPU/GPU usage.
- Camera features must run over HTTPS and ask permission clearly.
- Maintain GitHub Pages compatibility with relative asset URLs.

## Working style
Make small, testable changes. Explain modified files and testing steps. Avoid unnecessary redesigns.
