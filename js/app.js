'use strict';
const stage = document.getElementById('stage');
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
const panel = document.getElementById('panel');
const activate = document.getElementById('activate');
const motion = document.getElementById('motion');
const full = document.getElementById('full');
const preference = matchMedia('(prefers-reduced-motion: reduce)');
let active = false, particles = [], audioCtx, frame = null, lastTime = null;
let motionEnabled = false, drag = null, returnFocus = null;
const voices = new Set();
function size() {
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  particles = Array.from({length: 35}, () => ({x: Math.random()*innerWidth, y: Math.random()*innerHeight,
    v: .15+Math.random()*.65, r: .7+Math.random()*2.1, a: .2+Math.random()*.7,
    color: Math.random()>.5 ? '213,166,255' : '255,208,123'}));
}
function draw(time) {
  const step = lastTime === null ? 1 : Math.min((time-lastTime)/(1000/60), 2);
  lastTime = time;
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const p of particles) {
    p.y -= p.v*step;
    if (p.y<0) { p.y=innerHeight; p.x=Math.random()*innerWidth; }
    ctx.beginPath();
    ctx.fillStyle = `rgba(${p.color},${p.a})`;
    ctx.shadowBlur=15; ctx.shadowColor='#bc78ff';
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
  }
  frame = requestAnimationFrame(draw);
}
function syncAnimation() {
  if (frame !== null) cancelAnimationFrame(frame);
  frame = null; lastTime = null;
  ctx?.clearRect(0,0,innerWidth,innerHeight);
  if (ctx && active && !preference.matches && !document.hidden) frame=requestAnimationFrame(draw);
}
addEventListener('resize', size);
size();
// Unlock inside the user gesture before scheduling notes on the audio clock.
async function playNotes(frequencies, duration, spacing) {
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    audioCtx ||= new Audio();
    const context = audioCtx;
    if (context.state === 'suspended') await context.resume();
    if (!active || document.hidden || context !== audioCtx || context.state !== 'running') return;
    frequencies.forEach((frequency,index) => {
      const start=context.currentTime+index*spacing;
      const osc=context.createOscillator(), gain=context.createGain();
      osc.type='sine'; osc.frequency.setValueAtTime(frequency,start);
      gain.gain.setValueAtTime(.0001,start);
      gain.gain.exponentialRampToValueAtTime(.11,start+.02);
      gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
      osc.connect(gain).connect(context.destination);
      voices.add(osc);
      osc.onended=()=>{ voices.delete(osc); osc.disconnect(); gain.disconnect(); };
      osc.start(start); osc.stop(start+duration+.01);
    });
  } catch { /* Audio is optional; keep the visual experience usable. */ }
}
function stopAudio() {
  for (const voice of voices) { try { voice.stop(); } catch {} }
  voices.clear();
  const context=audioCtx; audioCtx=undefined;
  if (context) context.close().catch(()=>{});
}
function setOffset(x,y) {
  stage.style.setProperty('--x',Math.max(-25,Math.min(25,x))+'px');
  stage.style.setProperty('--y',Math.max(-20,Math.min(20,y))+'px');
}
function onOrientation(event) {
  if (document.hidden || panel.classList.contains('open') || drag) return;
  if (Number.isFinite(event.gamma) && Number.isFinite(event.beta)) setOffset(event.gamma*.55,event.beta*.2);
}
function disableMotion() {
  removeEventListener('deviceorientation',onOrientation);
  motionEnabled=false; motion.textContent='Enable Motion';
  motion.setAttribute('aria-pressed','false'); setOffset(0,0);
}
motion.onclick=async()=>{
  if (motionEnabled) { disableMotion(); return; }
  motion.disabled=true;
  try {
    if (typeof DeviceOrientationEvent==='undefined') throw Error('Unavailable');
    if (typeof DeviceOrientationEvent.requestPermission==='function') {
      const result=await DeviceOrientationEvent.requestPermission();
      if (result!=='granted') throw Error('Denied');
    }
    if (preference.matches) return;
    addEventListener('deviceorientation',onOrientation);
    motionEnabled=true; motion.textContent='Disable Motion'; motion.setAttribute('aria-pressed','true');
  } catch { alert('Motion tracking is unavailable here. Drag the scene instead.'); }
  finally { motion.disabled=preference.matches; }
};
function closePanel(restore=true) {
  panel.classList.remove('open'); panel.setAttribute('aria-hidden','true');
  for (const element of stage.children) if (element!==panel) element.inert=false;
  if (restore && returnFocus?.isConnected) returnFocus.focus();
  returnFocus=null;
}
activate.onclick=()=>{
  active=!active; stage.classList.toggle('active',active);
  document.getElementById('status').textContent=active?'Gallery awakened':'Preview mode';
  document.getElementById('heading').textContent=active?'Explore the Gallery':'The Living Gallery';
  document.getElementById('description').textContent=active
    ? 'Tap a glowing hotspot to interact with the painting, guitar, or vinyl collection.'
    : 'A purple-and-gold art space waiting to awaken. Experience a concept for an interactive smartphone gallery.';
  activate.textContent=active?'Reset Experience':'Awaken Gallery';
  activate.setAttribute('aria-pressed',String(active));
  if (active) void playNotes([392,493.88,587.33],.42,.17);
  else { closePanel(false); stopAudio(); disableMotion(); drag=null; }
  syncAnimation();
};
const copy={
  art:['Original Mixed-Media Artwork','This is the centerpiece of the experience. In a full AR build, animated purple highlights, floating gold particles, and layered fabric details would be anchored to your physical painting.'],
  guitar:['The Gallery Guitar','This interactive instrument can trigger original audio or animation. In the next version, it can become a separate 3D object.'],
  records:['The Vinyl Collection','Tap a record to reveal a themed artwork, audio narration, or a virtual collectible. Each can have its own story.']
};
document.querySelectorAll('.hotspot').forEach(button=>{
  button.onclick=()=>{
    if (!active) return;
    const kind=button.dataset.kind;
    document.getElementById('paneltitle').textContent=copy[kind][0];
    document.getElementById('panelbody').textContent=copy[kind][1];
    returnFocus=button; drag=null;
    panel.classList.add('open'); panel.setAttribute('aria-hidden','false');
    for (const element of stage.children) if (element!==panel) element.inert=true;
    document.getElementById('close').focus();
    if (kind==='guitar') void playNotes([196,246.94,293.66,392],.5,.14);
  };
});
document.getElementById('close').onclick=()=>closePanel();
document.addEventListener('keydown',event=>{
  if (!panel.classList.contains('open')) return;
  if (event.key==='Escape') { event.preventDefault(); closePanel(); }
  // Close is the dialog's only focusable control.
  if (event.key==='Tab') { event.preventDefault(); document.getElementById('close').focus(); }
});
function syncFullscreen() {
  const enabled=Boolean(document.fullscreenElement || document.webkitFullscreenElement);
  full.textContent=enabled?'Exit Fullscreen':'Fullscreen'; full.setAttribute('aria-pressed',String(enabled));
}
full.onclick=async()=>{
  try {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      const exit=document.exitFullscreen || document.webkitExitFullscreen;
      if (!exit) throw Error('Unavailable');
      await exit.call(document);
    } else {
      const enter=document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
      if (!enter) throw Error('Unavailable');
      await enter.call(document.documentElement);
    }
    syncFullscreen();
  } catch { alert('Fullscreen is unavailable here. On iPhone, use Safari Share → Add to Home Screen for an immersive view.'); }
};
document.addEventListener('fullscreenchange',syncFullscreen);
document.addEventListener('webkitfullscreenchange',syncFullscreen);
// A single pointer path avoids duplicate touch updates and leaves controls alone.
stage.addEventListener('pointerdown',event=>{
  if (preference.matches || !event.isPrimary || event.button!==0 || panel.classList.contains('open') ||
      event.target.closest('button, .panel')) return;
  drag={id:event.pointerId,x:event.clientX,y:event.clientY}; stage.setPointerCapture(event.pointerId);
});
stage.addEventListener('pointermove',event=>{
  if (!drag || drag.id!==event.pointerId) return;
  setOffset((event.clientX-drag.x)*.12,(event.clientY-drag.y)*.12);
});
function endDrag(event) { if (drag?.id===event.pointerId) drag=null; }
for (const type of ['pointerup','pointercancel','lostpointercapture']) stage.addEventListener(type,endDrag);
function syncPreference() {
  drag=null;
  if (preference.matches) disableMotion();
  motion.disabled=preference.matches;
  motion.title=preference.matches?'Motion is disabled by your reduced-motion preference.':'';
  syncAnimation();
}
preference.addEventListener('change',syncPreference);
document.addEventListener('visibilitychange',()=>{
  drag=null;
  if (document.hidden) stopAudio();
  syncAnimation();
});
syncPreference();
