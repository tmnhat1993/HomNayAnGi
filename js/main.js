// ============================================================
// MAIN.JS — App State Machine & Orchestration
// ============================================================

import { getRandomCard, getPowerStars, getPowerLabel, SUITS } from './data.js';
import { BgParticles } from './particles.js';
import { SuitVFX } from './vfx.js';
import gsap from 'gsap';

// ── State ────────────────────────────────────────────────────
const STATE = { IDLE: 'idle', DRAWING: 'drawing', REVEAL: 'reveal' };
let currentState = STATE.IDLE;
let currentCard = null;

// ── DOM refs ─────────────────────────────────────────────────
const screens = {
  idle:    document.getElementById('screen-idle'),
  drawing: document.getElementById('screen-drawing'),
  reveal:  document.getElementById('screen-reveal'),
};
const ctaBtn       = document.getElementById('ctaBtn');
const btnRetry     = document.getElementById('btnRetry');
const btnShare     = document.getElementById('btnShare');
const drawingText  = document.getElementById('drawingText');
const drawingCount = document.getElementById('drawingCountdown');
const drawingCanvas= document.getElementById('drawingCanvas');
const revealCanvas = document.getElementById('revealCanvas');
const bgCanvas     = document.getElementById('bgCanvas');
const deckCards    = document.querySelectorAll('.card-back');

// ── Systems ──────────────────────────────────────────────────
const bgParticles = new BgParticles(bgCanvas);
const suitVFX     = new SuitVFX(revealCanvas);
let drawingCtx    = drawingCanvas.getContext('2d');
let drawingAnim   = null;
let flyCards      = [];

// ── Init ─────────────────────────────────────────────────────
function init() {
  resizeCanvas(drawingCanvas);
  resizeCanvas(revealCanvas);
  window.addEventListener('resize', () => {
    resizeCanvas(drawingCanvas);
    resizeCanvas(revealCanvas);
  });

  bgParticles.start();
  animateIdleDeck();

  ctaBtn.addEventListener('click', onCtaClick);
  btnRetry.addEventListener('click', onRetryClick);
  btnShare.addEventListener('click', onShareClick);
}

function resizeCanvas(c) {
  c.width  = window.innerWidth;
  c.height = window.innerHeight;
}

// ── Screen Transitions ───────────────────────────────────────
function goTo(state) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[state].classList.add('active');
  currentState = state;
}

// ── IDLE: deck float animation ───────────────────────────────
function animateIdleDeck() {
  const wrapper = document.querySelector('.deck-wrapper');
  if (wrapper) {
    gsap.to(wrapper, {
      y: -10,
      duration: 2.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }
}

// ── CTA Click ─────────────────────────────────────────────────
function onCtaClick() {
  if (currentState !== STATE.IDLE) return;

  // Haptic
  if (navigator.vibrate) navigator.vibrate([50, 30, 100]);

  // Pick card immediately (hidden)
  currentCard = getRandomCard();

  gsap.to(ctaBtn, {
    scale: 0, duration: 0.3, ease: 'back.in(2)',
    onComplete: () => { startDrawingSequence(); }
  });
}

// ── Drawing sequence (5 seconds) ─────────────────────────────
function startDrawingSequence() {
  goTo(STATE.DRAWING);
  resizeCanvas(drawingCanvas);
  flyCards = [];

  // Spawn flying cards
  const W = drawingCanvas.width;
  const H = drawingCanvas.height;
  const cx = W / 2, cy = H / 2;

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    flyCards.push({
      x: cx, y: cy,
      tx: cx + Math.cos(angle) * (W * 0.4),
      ty: cy + Math.sin(angle) * (H * 0.35),
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.2,
      phase: 0, // 0=scatter, 1=spin, 2=gather
      w: 60, h: 85,
      color: `hsl(${Math.random()*30+5},80%,${20+Math.random()*20}%)`,
    });
  }

  let elapsed = 0;
  const totalMs = 5000;
  let lastTime = performance.now();
  let shakeX = 0, shakeY = 0;

  const MESSAGES = [
    { t: 0,    txt: 'Xáo bài...' },
    { t: 1500, txt: 'Đang chọn lọc...' },
    { t: 2800, txt: 'Số phận đã định...' },
    { t: 4000, txt: 'SẮP RA RỒI!' },
  ];
  let msgIdx = 0;

  drawingText.textContent = MESSAGES[0].txt;
  drawingCount.textContent = '';

  function loop(now) {
    const dt = now - lastTime;
    lastTime = now;
    elapsed += dt;

    const progress = Math.min(elapsed / totalMs, 1);

    // Messages
    while (msgIdx + 1 < MESSAGES.length && elapsed >= MESSAGES[msgIdx+1].t) {
      msgIdx++;
      drawingText.textContent = MESSAGES[msgIdx].txt;
      if (msgIdx === MESSAGES.length - 1 && navigator.vibrate) navigator.vibrate([100,50,200]);
    }

    // Countdown (last 3s)
    if (elapsed > 2000) {
      const remaining = Math.ceil((totalMs - elapsed) / 1000);
      drawingCount.textContent = remaining > 0 ? remaining : '';
    }

    // Screen shake at climax
    if (progress > 0.7) {
      const intensity = (progress - 0.7) / 0.3 * 8;
      shakeX = (Math.random()-0.5)*intensity;
      shakeY = (Math.random()-0.5)*intensity;
    } else {
      shakeX = 0; shakeY = 0;
    }

    // Update cards
    flyCards.forEach((c, i) => {
      if (progress < 0.2) {
        // Scatter
        c.x += (c.tx - c.x) * 0.08;
        c.y += (c.ty - c.y) * 0.08;
      } else if (progress < 0.7) {
        // Orbit
        const orbitAngle = (i/8)*Math.PI*2 + progress*6;
        const orbitR = Math.min(W,H)*0.3 * (1 - (progress-0.2)/0.5 * 0.3);
        c.x += (cx + Math.cos(orbitAngle)*orbitR*0.7 - c.x) * 0.1;
        c.y += (cy + Math.sin(orbitAngle)*orbitR*0.5 - c.y) * 0.1;
      } else {
        // Gather to center
        c.x += (cx - c.x) * 0.15;
        c.y += (cy - c.y) * 0.15;
      }
      c.rotation += c.rotSpeed * (1 + progress*3);
    });

    // Draw
    const dctx = drawingCtx;
    dctx.save();
    dctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);

    // Background
    const bg = dctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W,H));
    const col1 = `hsl(${15 + progress*20},80%,${5+progress*8}%)`;
    bg.addColorStop(0, col1);
    bg.addColorStop(1, '#000');
    dctx.fillStyle = bg;
    dctx.fillRect(0, 0, W, H);

    // Glow ring
    const ring = dctx.createRadialGradient(cx, cy, 0, cx, cy, 120 + progress*80);
    ring.addColorStop(0, `rgba(255,150,50,${0.1+progress*0.3})`);
    ring.addColorStop(1, 'transparent');
    dctx.fillStyle = ring;
    dctx.fillRect(0, 0, W, H);

    dctx.translate(shakeX, shakeY);

    // Draw flying cards
    flyCards.forEach(c => {
      dctx.save();
      dctx.translate(c.x, c.y);
      dctx.rotate(c.rotation);
      const w = c.w * (0.8 + progress*0.5);
      const h = c.h * (0.8 + progress*0.5);
      // Card shadow
      dctx.shadowColor = 'rgba(255,100,0,0.4)';
      dctx.shadowBlur = 15;
      // Card body
      roundRect(dctx, -w/2, -h/2, w, h, 6);
      dctx.fillStyle = c.color;
      dctx.fill();
      // Border
      dctx.strokeStyle = 'rgba(255,215,0,0.5)';
      dctx.lineWidth = 1.5;
      dctx.stroke();
      // Inner pattern
      dctx.shadowBlur = 0;
      dctx.font = `${w*0.4}px serif`;
      dctx.textAlign = 'center';
      dctx.textBaseline = 'middle';
      dctx.globalAlpha = 0.2;
      dctx.fillStyle = '#FFD700';
      dctx.fillText('🍜', 0, 0);
      dctx.globalAlpha = 1;
      dctx.restore();
    });

    // Flash effect near end
    if (progress > 0.92) {
      const flashAlpha = (progress - 0.92) / 0.08;
      dctx.fillStyle = `rgba(255,220,100,${flashAlpha * 0.8})`;
      dctx.fillRect(0, 0, W, H);
    }

    dctx.restore();

    if (progress < 1) {
      drawingAnim = requestAnimationFrame(loop);
    } else {
      // Done! → Reveal
      drawingCount.textContent = '';
      startReveal();
    }
  }

  drawingAnim = requestAnimationFrame(loop);
}

function startReveal() {
  goTo(STATE.REVEAL);
  resizeCanvas(revealCanvas);

  const card = currentCard;
  const suit = SUITS[card.suit];

  // Set background class
  const revealScreen = screens.reveal;
  revealScreen.className = 'screen active reveal-bg-' + suit.cls;

  // Populate card
  buildRevealCard(card, suit);

  // Start VFX
  suitVFX.start(card.suit);

  const label   = document.querySelector('.reveal-label');
  const revCard = document.getElementById('revealedCard');
  const powerBar= document.querySelector('.power-bar');
  const revBtns = document.querySelector('.reveal-buttons');

  // Reset visibility
  label.style.opacity   = '0';
  powerBar.style.opacity = '0';
  revBtns.style.opacity  = '0';

  gsap.set(ctaBtn, { scale: 1 });

  const tl = gsap.timeline();
  tl.fromTo(revCard,
      { scale: 0, rotation: -15, opacity: 0 },
      { scale: 1, rotation: 0,  opacity: 1, duration: 0.7, ease: 'back.out(1.8)', delay: 0.2 }
    )
    .to(label,    { opacity: 1, duration: 0.4 }, '-=0.1')
    .to(revCard,  { scale: 1.1, duration: 0.15, ease: 'power2.out', yoyo: true, repeat: 1 }, '+=0.1')
    .to(powerBar, { opacity: 1, duration: 0.4 }, '+=0.15')
    .to(revBtns,  { opacity: 1, duration: 0.4 }, '+=0.1');

  if (navigator.vibrate) navigator.vibrate([50, 50, 200]);
}

function buildRevealCard(card, suit) {
  const colorCls = suit.colorCls;
  const face = document.getElementById('cardFront');
  face.className = 'card-face card-front ' + suit.cls;

  document.getElementById('rankTop').textContent   = card.rank;
  document.getElementById('rankTop').className     = 'card-rank-top ' + colorCls;
  document.getElementById('suitTop').textContent   = suit.symbol;
  document.getElementById('suitTop').className     = 'card-suit-top ' + colorCls;

  const foodEl = document.getElementById('foodIcon');
  if (card.img) {
    foodEl.innerHTML = `<img src="${card.img}" alt="${card.food}" style="width:100%;height:100%;object-fit:contain;">`;
  } else {
    foodEl.innerHTML = '';
    foodEl.textContent = card.emoji;
  }
  document.getElementById('foodName').textContent  = card.food;
  document.getElementById('foodDesc').textContent  = card.desc;
  document.getElementById('rankBot').textContent   = card.rank;
  document.getElementById('rankBot').className     = 'card-rank-bot ' + colorCls;
  document.getElementById('suitBot').textContent   = suit.symbol;
  document.getElementById('suitBot').className     = 'card-suit-bot ' + colorCls;

  document.getElementById('revealLabel').textContent = `Hôm nay bạn sẽ ăn...`;
  document.getElementById('powerStars').textContent = getPowerStars(card.power);
  document.querySelector('.power-label').textContent = getPowerLabel(card.power) + ':';
}

// ── Retry ─────────────────────────────────────────────────────
function onRetryClick() {
  if (navigator.vibrate) navigator.vibrate([30]);
  suitVFX.stop();

  // Reset reveal screen class
  screens.reveal.className = 'screen';

  const revCard = document.getElementById('revealedCard');
  gsap.to(revCard, {
    scale: 0, rotation: -360, duration: 0.5, ease: 'back.in(2)',
    onComplete: () => goToIdle()
  });
}

function goToIdle() {
  goTo(STATE.IDLE);
  currentCard = null;
  gsap.set(document.getElementById('revealedCard'), { scale: 1, rotation: 0, opacity: 1 });
  gsap.set(ctaBtn, { scale: 1 });
}

// ── Share ─────────────────────────────────────────────────────
function onShareClick() {
  if (!currentCard) return;
  const card = currentCard;
  const suit = SUITS[card.suit];
  const text = `🎴 Hôm nay tôi ăn: ${card.food} ${card.emoji}\n${suit.symbol} ${card.rank} — ${getPowerLabel(card.power)}\n\nRút bài xem hôm nay ăn gì tại: Hôm Nay Ăn Gì?`;

  if (navigator.share) {
    navigator.share({ title: 'Hôm Nay Ăn Gì?', text }).catch(() => copyToClipboard(text));
  } else {
    copyToClipboard(text);
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('btnShare');
    const orig = btn.textContent;
    btn.textContent = '✅ Đã chép!';
    setTimeout(() => btn.textContent = orig, 2000);
  });
}

// ── Utils ─────────────────────────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ── Start ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
if (document.readyState !== 'loading') init();
