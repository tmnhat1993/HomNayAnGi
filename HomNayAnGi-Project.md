# 🍜 Hôm Nay Ăn Gì? — Tài Liệu Dự Án Đầy Đủ

> **Web app rút bài quyết định bữa ăn** — HTML5 Canvas + GSAP, không cần build step, chạy thẳng trên browser.

---

## Mục Lục

1. [Tổng Quan Dự Án](#1-tổng-quan-dự-án)
2. [Tech Stack & Kiến Trúc](#2-tech-stack--kiến-trúc)
3. [Cấu Trúc Thư Mục](#3-cấu-trúc-thư-mục)
4. [Thiết Kế & UI](#4-thiết-kế--ui)
5. [State Machine](#5-state-machine)
6. [Source Code Đầy Đủ](#6-source-code-đầy-đủ)
   - [index.html](#indexhtml)
   - [css/main.css](#cssmain-css)
   - [js/data.js](#jsdatajs)
   - [js/particles.js](#jsparticlesjs)
   - [js/vfx.js](#jsvfxjs)
   - [js/main.js](#jsmainjs)
7. [Hệ Thống Dữ Liệu 52 Lá Bài](#7-hệ-thống-dữ-liệu-52-lá-bài)
8. [Animation Chi Tiết](#8-animation-chi-tiết)
9. [VFX Theo Suit](#9-vfx-theo-suit)
10. [Tích Hợp Hình Ảnh AI](#10-tích-hợp-hình-ảnh-ai)
11. [AI Image Prompts](#11-ai-image-prompts)
12. [Roadmap Phát Triển](#12-roadmap-phát-triển)
13. [Hướng Dẫn Deploy](#13-hướng-dẫn-deploy)
14. [Changelog](#14-changelog)

---

## 1. Tổng Quan Dự Án

**"Hôm Nay Ăn Gì?"** là một web app dạng card game cho phép người dùng rút một lá bài ngẫu nhiên từ bộ 52 lá — mỗi lá đại diện cho một món ăn phổ biến tại Việt Nam — để quyết định bữa ăn trong ngày.

### Tính năng chính

- 🎴 **Bộ bài 52 lá** — mỗi lá là một món ăn với emoji, tên, mô tả và điểm sức mạnh
- 🎯 **4 lá Át mạnh nhất**: Phở Bò (♥), Cơm Tấm (♠), Bánh Mỳ (♦), Hủ Tiếu (♣)
- 🔥 **VFX theo suit**: Lửa (♥), Sét (♠), Mưa Đá (♦), Lũ Cuốn (♣)
- ✨ **Animation 3 phase**: Idle → Drawing (5s) → Reveal
- 📱 **Mobile-first**: Haptic feedback, touch events, responsive layout
- 📤 **Web Share API**: Chia sẻ kết quả lên mạng xã hội

---

## 2. Tech Stack & Kiến Trúc

| Layer              | Công nghệ         | Mục đích                                 |
| ------------------ | ----------------- | ---------------------------------------- |
| Rendering          | HTML5 Canvas API  | Particle systems, VFX, drawing animation |
| Animation          | GSAP 3.12.5 (CDN) | Timeline, easing, UI transitions         |
| Styling            | CSS3              | Layout, card design, keyframe animations |
| Logic              | Vanilla JS (ES6+) | State machine, game logic                |
| Fonts              | Google Fonts CDN  | Baloo 2 + Be Vietnam Pro                 |
| Sound _(optional)_ | Howler.js         | SFX management                           |

**Không cần**: Node.js, npm, build tools, webpack, React, Vue — chỉ cần browser.

---

## 3. Cấu Trúc Thư Mục

```
food-card/
├── index.html              ← Entry point, HTML shell
├── css/
│   └── main.css            ← Toàn bộ styles (479 dòng)
├── js/
│   ├── data.js             ← 52 card definitions + helper functions
│   ├── particles.js        ← Background particle system (idle)
│   ├── vfx.js              ← Suit VFX: fire/lightning/hail/flood
│   └── main.js             ← State machine, drawing anim, reveal
└── assets/
    ├── images/             ← (TODO) 52 PNG món ăn từ AI gen
    └── sounds/             ← (TODO) 9 file MP3 SFX
```

---

## 4. Thiết Kế & UI

### Color System

| Token      | Hex       | Sử dụng                |
| ---------- | --------- | ---------------------- |
| `--orange` | `#FF6B35` | CTA button, highlights |
| `--gold`   | `#FFD700` | Viền bài, stars        |
| `--dark`   | `#1A0A00` | Background chính       |
| Heart      | `#CC0000` | Suit ♥, card border    |
| Spade      | `#0A1628` | Suit ♠, card border    |
| Diamond    | `#0066AA` | Suit ♦, card border    |
| Club       | `#006622` | Suit ♣, card border    |

### Typography

| Font               | Weights         | Dùng cho                    |
| ------------------ | --------------- | --------------------------- |
| **Baloo 2**        | 400/600/700/800 | Tiêu đề, CTA, rank, tên món |
| **Be Vietnam Pro** | 400/600/700     | Mô tả, subtitle, text phụ   |

### Card Dimensions

- **Tỷ lệ**: 1 : 1.45 (poker standard)
- **Width**: `min(220px, 55vw)` — responsive
- **Height**: `width × 1.45`
- **Border radius**: `width × 0.06`

### Wireframe Screens

```
┌─────────────────────────┐   ┌─────────────────────────┐   ┌─────────────────────────┐
│      IDLE SCREEN        │   │    DRAWING (5s)          │   │     REVEAL SCREEN       │
│                         │   │                         │   │                         │
│  ✨ Đừng nghĩ nữa ✨    │   │   [Cards orbit madly]   │   │  Hôm nay bạn sẽ ăn...  │
│                         │   │                         │   │                         │
│   HÔM NAY ĂN GÌ?       │   │  "Số phận đã định..."   │   │     ┌──────────┐        │
│  (gradient text)        │   │                         │   │     │  ♥  A    │        │
│                         │   │        3                │   │     │  🍜      │        │
│    🃏🃏🃏🃏🃏            │   │    (countdown)          │   │     │ Phở Bò   │        │
│   (deck, floating)      │   │                         │   │     └──────────┘        │
│                         │   │   [Flash → Reveal]      │   │                         │
│  ┌───────────────────┐  │   │                         │   │  👑 Tối Thượng: ⭐⭐⭐⭐⭐ │
│  │  🎴 RÚT BÀI NGAY │  │   │                         │   │                         │
│  └───────────────────┘  │   │                         │   │  [🔄 Rút Lại] [📤 Share]│
└─────────────────────────┘   └─────────────────────────┘   └─────────────────────────┘
```

---

## 5. State Machine

```
         ┌─────────────────────────────────────────┐
         │                                         │
         ▼                                         │
    ┌─────────┐   click CTA   ┌──────────┐        │
    │  IDLE   │ ────────────► │ DRAWING  │        │
    └─────────┘               │  (5s)   │        │
         ▲                    └──────────┘        │
         │                         │ onComplete    │
    goToIdle()                     ▼               │
         │                    ┌──────────┐        │
         └──────────────────  │  REVEAL  │ ───────┘
                 retry click  └──────────┘  share click
```

**State variables:**

- `currentState`: `'idle' | 'drawing' | 'reveal'`
- `currentCard`: Object `{ suit, rank, power, food, emoji, desc }` hoặc `null`

---

## 6. Source Code Đầy Đủ

### index.html

```html
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
    <title>Hôm Nay Ăn Gì? 🍜</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&family=Be+Vietnam+Pro:wght@400;600;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="css/main.css" />
  </head>
  <body>
    <!-- Background canvas for particles -->
    <canvas id="bgCanvas"></canvas>

    <!-- App container -->
    <div id="app">
      <!-- IDLE SCREEN -->
      <div id="screen-idle" class="screen active">
        <div class="idle-content">
          <div class="title-area">
            <p class="subtitle">✨ Đừng nghĩ nữa, để số phận quyết định ✨</p>
            <h1 class="main-title">
              <span class="t1">HÔM</span>
              <span class="t2">NAY</span>
              <span class="t3">ĂN</span>
              <span class="t4">GÌ?</span>
            </h1>
          </div>

          <div class="deck-area" id="deckArea">
            <div class="deck-wrapper">
              <div class="card-back c5"></div>
              <div class="card-back c4"></div>
              <div class="card-back c3"></div>
              <div class="card-back c2"></div>
              <div class="card-back c1"></div>
            </div>
            <div class="deck-glow"></div>
          </div>

          <button class="cta-btn" id="ctaBtn">
            <span class="cta-icon">🎴</span>
            <span class="cta-text">RÚT BÀI NGAY!</span>
            <span class="cta-sub">52 món ăn đang chờ bạn</span>
          </button>
        </div>
      </div>

      <!-- DRAWING SCREEN -->
      <div id="screen-drawing" class="screen">
        <canvas id="drawingCanvas"></canvas>
        <div class="drawing-overlay">
          <div class="drawing-text" id="drawingText">Đang xáo bài...</div>
          <div class="drawing-countdown" id="drawingCountdown"></div>
        </div>
      </div>

      <!-- REVEAL SCREEN -->
      <div id="screen-reveal" class="screen">
        <canvas id="revealCanvas"></canvas>
        <div class="reveal-content">
          <div class="reveal-label" id="revealLabel">Hôm nay bạn sẽ ăn...</div>
          <div class="revealed-card" id="revealedCard">
            <div class="card-inner" id="cardInner">
              <div class="card-face card-front" id="cardFront">
                <div class="card-rank-top" id="rankTop"></div>
                <div class="card-suit-top" id="suitTop"></div>
                <div class="card-center-food" id="foodIcon"></div>
                <div class="card-food-name" id="foodName"></div>
                <div class="card-food-desc" id="foodDesc"></div>
                <div class="card-rank-bot" id="rankBot"></div>
                <div class="card-suit-bot" id="suitBot"></div>
              </div>
            </div>
          </div>
          <div class="power-bar" id="powerBar">
            <span class="power-label">Sức mạnh:</span>
            <span class="power-stars" id="powerStars"></span>
          </div>
          <div class="reveal-buttons">
            <button class="btn-retry" id="btnRetry">🔄 Rút Lại</button>
            <button class="btn-share" id="btnShare">📤 Chia Sẻ</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
    <script src="js/data.js"></script>
    <script src="js/particles.js"></script>
    <script src="js/vfx.js"></script>
    <script src="js/main.js"></script>
  </body>
</html>
```

---

### css/main.css

```css
/* ============================================================
   HÔM NAY ĂN GÌ? — Main Stylesheet
   ============================================================ */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --orange: #ff6b35;
  --orange-light: #ff9a6c;
  --gold: #ffd700;
  --gold-dark: #c8a400;
  --cream: #fff8f0;
  --dark: #1a0a00;
  --red: #e8001c;
  --navy: #0a1628;
  --ice: #a8d8ea;
  --green-dark: #1b4332;
  --card-w: min(220px, 55vw);
  --card-h: calc(var(--card-w) * 1.45);
  --card-radius: calc(var(--card-w) * 0.06);
}

html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: "Be Vietnam Pro", sans-serif;
  background: #1a0a00;
  color: white;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* ── Canvas ── */
#bgCanvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

/* ── App ── */
#app {
  position: fixed;
  inset: 0;
  z-index: 1;
}

/* ── Screens ── */
.screen {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
}
.screen.active {
  opacity: 1;
  pointer-events: all;
}

/* ============================================================
   IDLE SCREEN
   ============================================================ */
#screen-idle {
  background: transparent;
}

.idle-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(16px, 4vh, 32px);
  padding: 24px 20px;
  width: 100%;
  max-width: 480px;
}

/* Title */
.subtitle {
  font-size: clamp(11px, 2.5vw, 14px);
  color: rgba(255, 255, 200, 0.75);
  letter-spacing: 0.05em;
  text-align: center;
  animation: fadeInDown 1s ease both;
}

.main-title {
  font-family: "Baloo 2", cursive;
  font-size: clamp(44px, 13vw, 88px);
  font-weight: 800;
  text-align: center;
  line-height: 1;
  letter-spacing: -0.02em;
  display: flex;
  gap: 0.15em;
  flex-wrap: wrap;
  justify-content: center;
}
.main-title span {
  display: inline-block;
  background: linear-gradient(135deg, #ffd700, #ff6b35, #ff3b3b);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
  filter: drop-shadow(0 0 20px rgba(255, 107, 53, 0.6));
  animation: titleDrop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.main-title .t1 {
  animation-delay: 0.1s;
}
.main-title .t2 {
  animation-delay: 0.22s;
}
.main-title .t3 {
  animation-delay: 0.34s;
}
.main-title .t4 {
  animation-delay: 0.46s;
}

/* Deck */
.deck-area {
  position: relative;
  width: var(--card-w);
  height: calc(var(--card-h) + 40px);
  margin: 8px auto;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.deck-wrapper {
  position: relative;
  width: var(--card-w);
  height: var(--card-h);
  flex-shrink: 0;
}

.card-back {
  position: absolute;
  width: var(--card-w);
  height: var(--card-h);
  border-radius: var(--card-radius);
  background: #7b1f1f;
  border: 3px solid var(--gold);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    inset 0 0 0 8px rgba(255, 215, 0, 0.08);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.card-back::before {
  content: "";
  position: absolute;
  inset: 8px;
  border-radius: calc(var(--card-radius) - 2px);
  border: 2px solid rgba(255, 215, 0, 0.35);
  background:
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 12px,
      rgba(255, 215, 0, 0.04) 12px,
      rgba(255, 215, 0, 0.04) 13px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 12px,
      rgba(255, 107, 53, 0.04) 12px,
      rgba(255, 107, 53, 0.04) 13px
    );
}

.card-back::after {
  content: "🍜";
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(var(--card-w) * 0.35);
  opacity: 0.15;
  filter: blur(1px);
}

/* Stacked offsets — absolute within deck-wrapper */
.c1 {
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(0px) rotate(0deg);
  z-index: 5;
}
.c2 {
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(-4px) rotate(-3deg);
  z-index: 4;
}
.c3 {
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(-7px) rotate(2.5deg);
  z-index: 3;
}
.c4 {
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(-9px) rotate(-1.5deg);
  z-index: 2;
}
.c5 {
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(-11px) rotate(1deg);
  z-index: 1;
}

.deck-glow {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 30px;
  background: radial-gradient(
    ellipse,
    rgba(255, 107, 53, 0.5) 0%,
    transparent 70%
  );
  filter: blur(8px);
  animation: glowPulse 2s ease-in-out infinite;
}

/* CTA Button */
.cta-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: clamp(14px, 3vh, 20px) clamp(32px, 8vw, 60px);
  background: linear-gradient(135deg, #ff6b35, #e8001c);
  border: 3px solid rgba(255, 215, 0, 0.6);
  border-radius: 60px;
  cursor: pointer;
  color: white;
  font-family: "Baloo 2", cursive;
  font-weight: 800;
  font-size: clamp(18px, 5vw, 26px);
  letter-spacing: 0.05em;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 6px 30px rgba(232, 0, 28, 0.5),
    0 0 0 0 rgba(255, 107, 53, 0.4);
  animation: ctaPulse 2s ease-in-out infinite;
  -webkit-user-select: none;
  user-select: none;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
  min-width: min(280px, 80vw);
}
.cta-btn:active {
  transform: scale(0.96);
  box-shadow: 0 3px 15px rgba(232, 0, 28, 0.5);
}
.cta-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.25),
    transparent
  );
  animation: shimmer 2.5s ease-in-out infinite;
}
.cta-icon {
  font-size: clamp(22px, 6vw, 32px);
}
.cta-text {
  line-height: 1;
}
.cta-sub {
  font-size: clamp(10px, 2.5vw, 13px);
  font-weight: 400;
  font-family: "Be Vietnam Pro", sans-serif;
  opacity: 0.85;
}

/* ============================================================
   DRAWING SCREEN
   ============================================================ */
#screen-drawing {
  background: radial-gradient(circle at center, #1a0a00, #000);
}
#drawingCanvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.drawing-overlay {
  position: relative;
  z-index: 10;
  text-align: center;
  pointer-events: none;
}
.drawing-text {
  font-family: "Baloo 2", cursive;
  font-size: clamp(20px, 5vw, 32px);
  color: var(--gold);
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
  margin-bottom: 16px;
}
.drawing-countdown {
  font-family: "Baloo 2", cursive;
  font-size: clamp(60px, 20vw, 120px);
  font-weight: 800;
  color: white;
  text-shadow:
    0 0 60px rgba(255, 107, 53, 1),
    0 0 120px rgba(255, 107, 53, 0.5);
  line-height: 1;
}

/* ============================================================
   REVEAL SCREEN
   ============================================================ */
#screen-reveal {
  background: transparent;
}

#revealCanvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.reveal-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(12px, 3vh, 24px);
  padding: 20px;
}
.reveal-label {
  font-size: clamp(13px, 3.5vw, 18px);
  color: rgba(255, 255, 200, 0.9);
  letter-spacing: 0.08em;
  opacity: 0;
}

/* Revealed card — no flip, show front directly */
.revealed-card {
  width: var(--card-w);
  height: var(--card-h);
  cursor: default;
}
.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
}
.card-face {
  position: absolute;
  inset: 0;
  border-radius: var(--card-radius);
}
.card-front {
  display: grid;
  grid-template-rows: auto auto 1fr auto auto auto;
  padding: clamp(8px, 3%, 14px);
  border: 3px solid transparent;
  overflow: hidden;
}

/* Suit-specific card colors */
.card-front.heart {
  background: linear-gradient(160deg, #fff9f9, #ffe8e8);
  border-color: #cc0000;
}
.card-front.spade {
  background: linear-gradient(160deg, #f0f0f5, #e0e0ef);
  border-color: #1a1a40;
}
.card-front.diamond {
  background: linear-gradient(160deg, #f0faff, #dff2ff);
  border-color: #0066aa;
}
.card-front.club {
  background: linear-gradient(160deg, #f0fff4, #d8f0e0);
  border-color: #006622;
}

.card-rank-top,
.card-rank-bot {
  font-family: "Baloo 2", cursive;
  font-weight: 800;
  font-size: clamp(16px, 5%, 22px);
  line-height: 1;
}
.card-rank-bot {
  text-align: right;
  transform: rotate(180deg);
}
.card-suit-top,
.card-suit-bot {
  font-size: clamp(14px, 4%, 20px);
  line-height: 1;
}
.card-suit-bot {
  text-align: right;
  transform: rotate(180deg);
}

.heart-color {
  color: #cc0000;
}
.spade-color {
  color: #1a1a40;
}
.diamond-color {
  color: #0055aa;
}
.club-color {
  color: #005500;
}

.card-center-food {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(44px, 14vw, 72px);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  animation: foodBounce 1s ease infinite alternate;
}
.card-food-name {
  text-align: center;
  font-family: "Baloo 2", cursive;
  font-weight: 800;
  font-size: clamp(13px, 4vw, 18px);
  line-height: 1.1;
  padding: 4px 2px;
  color: #1a0a00;
}
.card-food-desc {
  text-align: center;
  font-size: clamp(9px, 2.5vw, 11px);
  color: rgba(26, 10, 0, 0.6);
  line-height: 1.3;
  padding: 0 4px 4px;
}

/* Power bar */
.power-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: clamp(12px, 3vw, 15px);
  opacity: 0;
}
.power-label {
  color: rgba(255, 255, 200, 0.8);
}
.power-stars {
  font-size: clamp(14px, 4vw, 20px);
  letter-spacing: 2px;
}

/* Buttons */
.reveal-buttons {
  display: flex;
  gap: 16px;
  opacity: 0;
}
.btn-retry,
.btn-share {
  padding: 12px 28px;
  border-radius: 50px;
  font-family: "Baloo 2", cursive;
  font-weight: 700;
  font-size: clamp(14px, 4vw, 17px);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  min-width: 120px;
}
.btn-retry {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
  backdrop-filter: blur(10px);
}
.btn-retry:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}
.btn-retry:active {
  transform: scale(0.96);
}
.btn-share {
  background: linear-gradient(135deg, #ff6b35, #e8001c);
  border-color: rgba(255, 215, 0, 0.5);
  color: white;
}
.btn-share:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(232, 0, 28, 0.4);
}
.btn-share:active {
  transform: scale(0.96);
}

/* ============================================================
   KEYFRAME ANIMATIONS
   ============================================================ */
@keyframes titleDrop {
  from {
    opacity: 0;
    transform: translateY(-40px) scale(0.5);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes ctaPulse {
  0%,
  100% {
    box-shadow:
      0 6px 30px rgba(232, 0, 28, 0.5),
      0 0 0 0 rgba(255, 107, 53, 0.4);
  }
  50% {
    box-shadow:
      0 6px 30px rgba(232, 0, 28, 0.6),
      0 0 0 14px rgba(255, 107, 53, 0);
  }
}
@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
}
@keyframes glowPulse {
  0%,
  100% {
    opacity: 0.6;
    transform: translateX(-50%) scaleX(1);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) scaleX(1.2);
  }
}
@keyframes foodBounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-6px);
  }
}

/* deckFloat handled by GSAP in main.js */

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-height: 600px) {
  .idle-content {
    gap: 12px;
  }
  .deck-area {
    height: calc(var(--card-h) + 20px);
  }
}
@media (min-width: 600px) {
  #app {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .screen {
    max-width: 500px;
    margin: auto;
    border-radius: 24px;
  }
}

/* Suit reveal backgrounds */
.reveal-bg-heart {
  background: radial-gradient(
    circle at center,
    #3d0000 0%,
    #1a0000 60%,
    #000 100%
  );
}
.reveal-bg-spade {
  background: radial-gradient(
    circle at center,
    #000510 0%,
    #000020 60%,
    #000 100%
  );
}
.reveal-bg-diamond {
  background: radial-gradient(
    circle at center,
    #001525 0%,
    #000a15 60%,
    #000 100%
  );
}
.reveal-bg-club {
  background: radial-gradient(
    circle at center,
    #001508 0%,
    #000a05 60%,
    #000 100%
  );
}
```

---

### js/data.js

```javascript
// ============================================================
// DATA.JS — 52 Food Cards
// ============================================================

const SUITS = {
  HEART: {
    symbol: "♥",
    name: "Heart",
    cls: "heart",
    colorCls: "heart-color",
    emoji: "❤️",
  },
  SPADE: {
    symbol: "♠",
    name: "Spade",
    cls: "spade",
    colorCls: "spade-color",
    emoji: "⚫",
  },
  DIAMOND: {
    symbol: "♦",
    name: "Diamond",
    cls: "diamond",
    colorCls: "diamond-color",
    emoji: "💎",
  },
  CLUB: {
    symbol: "♣",
    name: "Club",
    cls: "club",
    colorCls: "club-color",
    emoji: "🍀",
  },
};

const RANKS = [
  "A",
  "K",
  "Q",
  "J",
  "10",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];

// power: 13 (Ace) → 1 (Two)
// img: 'assets/images/pho-bo.png' (để trống, thêm sau khi có AI images)
const CARDS = [
  // ── ACE (Power 13) ─────────────────────────────────────────
  {
    suit: "HEART",
    rank: "A",
    power: 13,
    food: "Phở Bò",
    emoji: "🍜",
    desc: "Tô phở nóng hổi, nước dùng ngọt thanh, bánh phở dai mềm",
  },
  {
    suit: "SPADE",
    rank: "A",
    power: 13,
    food: "Cơm Tấm",
    emoji: "🍛",
    desc: "Sườn nướng thơm lừng, bì chả, trứng ốp, nước mắm pha",
  },
  {
    suit: "DIAMOND",
    rank: "A",
    power: 13,
    food: "Bánh Mỳ",
    emoji: "🥖",
    desc: "Bánh mỳ giòn tan, nhân đa dạng, ăn nhanh no lâu",
  },
  {
    suit: "CLUB",
    rank: "A",
    power: 13,
    food: "Hủ Tiếu",
    emoji: "🍝",
    desc: "Hủ tiếu nam vang, nước lèo trong vắt, thịt bằm thơm",
  },
  // ── KING (Power 12) ────────────────────────────────────────
  {
    suit: "HEART",
    rank: "K",
    power: 12,
    food: "Bún Bò Huế",
    emoji: "🥣",
    desc: "Bún bò cay nồng, chả lụa, móng heo, mắm ruốc đặc trưng",
  },
  {
    suit: "SPADE",
    rank: "K",
    power: 12,
    food: "Cơm Rang",
    emoji: "🍚",
    desc: "Cơm chiên vàng ruộm, trứng, rau củ, dễ ăn mọi bữa",
  },
  {
    suit: "DIAMOND",
    rank: "K",
    power: 12,
    food: "Bánh Cuốn",
    emoji: "🌯",
    desc: "Bánh cuốn mỏng mịn, nhân thịt nấm, chả quế, chấm nước mắm",
  },
  {
    suit: "CLUB",
    rank: "K",
    power: 12,
    food: "Mì Quảng",
    emoji: "🍜",
    desc: "Mì quảng đặc sánh, tôm thịt, bánh tráng nướng giòn",
  },
  // ── QUEEN (Power 11) ───────────────────────────────────────
  {
    suit: "HEART",
    rank: "Q",
    power: 11,
    food: "Bún Riêu",
    emoji: "🦀",
    desc: "Bún riêu cua đồng, cà chua, đậu hũ chiên, mắm tôm",
  },
  {
    suit: "SPADE",
    rank: "Q",
    power: 11,
    food: "Cơm Chiên DL",
    emoji: "🍳",
    desc: "Cơm chiên Dương Châu, tôm thịt, trứng, ngò rí thơm",
  },
  {
    suit: "DIAMOND",
    rank: "Q",
    power: 11,
    food: "Bánh Ướt",
    emoji: "🫔",
    desc: "Bánh ướt tươi mềm, chả lụa, hành phi, tương ớt",
  },
  {
    suit: "CLUB",
    rank: "Q",
    power: 11,
    food: "Cao Lầu",
    emoji: "🍝",
    desc: "Cao lầu Hội An, sợi mì dai, thịt xá xíu, bánh đa giòn",
  },
  // ── JACK (Power 10) ────────────────────────────────────────
  {
    suit: "HEART",
    rank: "J",
    power: 10,
    food: "Bún Mắm",
    emoji: "🍲",
    desc: "Bún mắm miền Tây, hải sản, thịt quay, rau ghém tươi",
  },
  {
    suit: "SPADE",
    rank: "J",
    power: 10,
    food: "Cơm Niêu",
    emoji: "🪔",
    desc: "Cơm cháy niêu đất, canh chua, thịt kho trứng",
  },
  {
    suit: "DIAMOND",
    rank: "J",
    power: 10,
    food: "Bánh Khọt",
    emoji: "🧇",
    desc: "Bánh khọt nhỏ xinh, tôm, mỡ hành, ăn kèm rau sống",
  },
  {
    suit: "CLUB",
    rank: "J",
    power: 10,
    food: "Phở Xào",
    emoji: "🥘",
    desc: "Phở xào giòn, hải sản hoặc bò, giá trụng, nước sốt đặm",
  },
  // ── 10 (Power 9) ───────────────────────────────────────────
  {
    suit: "HEART",
    rank: "10",
    power: 9,
    food: "Súp Cua",
    emoji: "🦀",
    desc: "Súp cua béo ngậy, trứng cút, nấm, miến mềm",
  },
  {
    suit: "SPADE",
    rank: "10",
    power: 9,
    food: "Lẩu Thái",
    emoji: "🫕",
    desc: "Lẩu thái chua cay, tôm, mực, bông lau thơm",
  },
  {
    suit: "DIAMOND",
    rank: "10",
    power: 9,
    food: "Bánh Canh",
    emoji: "🍲",
    desc: "Bánh canh sợi tươi, giò heo, chả cá, nước trong",
  },
  {
    suit: "CLUB",
    rank: "10",
    power: 9,
    food: "Miến Gà",
    emoji: "🍜",
    desc: "Miến gà trong vắt, thịt gà xé, hành phi, tiêu xay",
  },
  // ── 9 (Power 8) ────────────────────────────────────────────
  {
    suit: "HEART",
    rank: "9",
    power: 8,
    food: "Bún Thái",
    emoji: "🍜",
    desc: "Bún thái chua ngọt, hải sản, sả, ớt, rau thơm",
  },
  {
    suit: "SPADE",
    rank: "9",
    power: 8,
    food: "Cơm Gà HN",
    emoji: "🍗",
    desc: "Cơm gà ta nấu chuẩn, nước mắm gừng, rau sống",
  },
  {
    suit: "DIAMOND",
    rank: "9",
    power: 8,
    food: "Xôi Mặn",
    emoji: "🍱",
    desc: "Xôi xéo, xôi gà, hay xôi lạp xưởng béo bùi",
  },
  {
    suit: "CLUB",
    rank: "9",
    power: 8,
    food: "Hủ Tiếu Khô",
    emoji: "🍝",
    desc: "Hủ tiếu khô trộn, thịt bằm, tôm, giá mỡ hành",
  },
  // ── 8 (Power 7) ────────────────────────────────────────────
  {
    suit: "HEART",
    rank: "8",
    power: 7,
    food: "Mì Tôm Trứng",
    emoji: "🥚",
    desc: "Mì tôm xào trứng nhanh gọn, rau cải, xúc xích",
  },
  {
    suit: "SPADE",
    rank: "8",
    power: 7,
    food: "Cơm Sườn Cọng",
    emoji: "🥩",
    desc: "Cơm sườn non kho mềm, dưa leo, canh chua nóng",
  },
  {
    suit: "DIAMOND",
    rank: "8",
    power: 7,
    food: "Bánh Bèo",
    emoji: "🫙",
    desc: "Bánh bèo Huế, nước mắm tôm chấy, mỡ hành thơm",
  },
  {
    suit: "CLUB",
    rank: "8",
    power: 7,
    food: "Cháo Lòng",
    emoji: "🍵",
    desc: "Cháo lòng heo mềm mịn, quẩy, hành ngò, tiêu",
  },
  // ── 7 (Power 6) ────────────────────────────────────────────
  {
    suit: "HEART",
    rank: "7",
    power: 6,
    food: "Bún Chả HN",
    emoji: "🥢",
    desc: "Bún chả Hà Nội, chả nướng thơm, nước chấm ngọt",
  },
  {
    suit: "SPADE",
    rank: "7",
    power: 6,
    food: "Cơm Tứ Xuyên",
    emoji: "🌶️",
    desc: "Cơm rang kiểu Tứ Xuyên cay mê, rau củ, thịt",
  },
  {
    suit: "DIAMOND",
    rank: "7",
    power: 6,
    food: "Xôi Xéo",
    emoji: "🌽",
    desc: "Xôi xéo đậu xanh béo ngậy, hành phi vàng ruộm",
  },
  {
    suit: "CLUB",
    rank: "7",
    power: 6,
    food: "Cháo Gà",
    emoji: "🐓",
    desc: "Cháo gà ta nấu gừng, thịt xé, hành lá, tiêu trắng",
  },
  // ── 6 (Power 5) ────────────────────────────────────────────
  {
    suit: "HEART",
    rank: "6",
    power: 5,
    food: "Mì Hoành Thánh",
    emoji: "🥟",
    desc: "Mì sợi vàng, hoành thánh nhân tôm thịt, xá xíu",
  },
  {
    suit: "SPADE",
    rank: "6",
    power: 5,
    food: "Cơm Trắng Kho",
    emoji: "🍽️",
    desc: "Cơm trắng kho cá, thịt kho tàu, canh rau đơn giản",
  },
  {
    suit: "DIAMOND",
    rank: "6",
    power: 5,
    food: "Bánh Tráng Trộn",
    emoji: "🌶️",
    desc: "Bánh tráng trộn, xoài xanh, khô bò, tương ớt",
  },
  {
    suit: "CLUB",
    rank: "6",
    power: 5,
    food: "Cháo Trắng",
    emoji: "🍚",
    desc: "Cháo trắng húp nóng, ăn với mắm, trứng chiên, dưa",
  },
  // ── 5 (Power 4) ────────────────────────────────────────────
  {
    suit: "HEART",
    rank: "5",
    power: 4,
    food: "Bún Thịt Nướng",
    emoji: "🥗",
    desc: "Bún thịt nướng sả ớt, chả giò, rau sống, nước mắm",
  },
  {
    suit: "SPADE",
    rank: "5",
    power: 4,
    food: "Cơm Tấm Sườn",
    emoji: "🍖",
    desc: "Cơm tấm sườn đặc biệt, bì, chả, nước mắm tỏi ớt",
  },
  {
    suit: "DIAMOND",
    rank: "5",
    power: 4,
    food: "Sandwich",
    emoji: "🥪",
    desc: "Sandwich nhân thịt nguội, phô mai, rau tươi, sốt",
  },
  {
    suit: "CLUB",
    rank: "5",
    power: 4,
    food: "Cháo Đậu",
    emoji: "🫘",
    desc: "Cháo đậu xanh bí đỏ, thanh mát, dễ tiêu",
  },
  // ── 4 (Power 3) ────────────────────────────────────────────
  {
    suit: "HEART",
    rank: "4",
    power: 3,
    food: "Súp Nui",
    emoji: "🍝",
    desc: "Súp nui gà béo nhẹ, cà rốt, khoai tây, thịt bằm",
  },
  {
    suit: "SPADE",
    rank: "4",
    power: 3,
    food: "Cơm Hến",
    emoji: "🐚",
    desc: "Cơm hến Huế, hến xào, rau sống, mắm ruốc, ớt",
  },
  {
    suit: "DIAMOND",
    rank: "4",
    power: 3,
    food: "Bánh Tiêu",
    emoji: "🥯",
    desc: "Bánh tiêu giòn phồng, ăn sáng nhanh, chấm sữa đặc",
  },
  {
    suit: "CLUB",
    rank: "4",
    power: 3,
    food: "Nui Xào",
    emoji: "🍝",
    desc: "Nui xào thịt bò, cà chua, hành tây, sốt cà đặm",
  },
  // ── 3 (Power 2) ────────────────────────────────────────────
  {
    suit: "HEART",
    rank: "3",
    power: 2,
    food: "Tokbokki",
    emoji: "🌶️",
    desc: "Tokbokki cay ngọt, chả cá, trứng luộc, phô mai",
  },
  {
    suit: "SPADE",
    rank: "3",
    power: 2,
    food: "Cơm Trộn",
    emoji: "🥗",
    desc: "Cơm trộn kiểu Hàn, kimchi, trứng, rong biển",
  },
  {
    suit: "DIAMOND",
    rank: "3",
    power: 2,
    food: "Bánh Bao",
    emoji: "🥟",
    desc: "Bánh bao nhân thịt trứng cút, ăn sáng tiện lợi",
  },
  {
    suit: "CLUB",
    rank: "3",
    power: 2,
    food: "Nui Sốt Bò",
    emoji: "🥩",
    desc: "Nui sốt bò băm kiểu Ý, phô mai, húng quế",
  },
  // ── 2 (Power 1) ────────────────────────────────────────────
  {
    suit: "HEART",
    rank: "2",
    power: 1,
    food: "Salad",
    emoji: "🥗",
    desc: "Salad rau tươi, ức gà, sốt mè rang, healthy",
  },
  {
    suit: "SPADE",
    rank: "2",
    power: 1,
    food: "Ăn Kiêng",
    emoji: "🥦",
    desc: "Rau luộc, ức gà hấp, thanh mát, nhẹ bụng",
  },
  {
    suit: "DIAMOND",
    rank: "2",
    power: 1,
    food: "Granola",
    emoji: "🥣",
    desc: "Granola sữa chua, trái cây tươi, ăn sáng nhanh",
  },
  {
    suit: "CLUB",
    rank: "2",
    power: 1,
    food: "Yến Mạch",
    emoji: "🌾",
    desc: "Yến mạch nấu sữa, chuối, mật ong, thanh đạm",
  },
];

function getRandomCard() {
  return CARDS[Math.floor(Math.random() * CARDS.length)];
}

function getPowerStars(power) {
  const maxStars = 5;
  const filledStars = Math.ceil((power / 13) * maxStars);
  let s = "";
  for (let i = 0; i < maxStars; i++) s += i < filledStars ? "⭐" : "☆";
  return s;
}

function getPowerLabel(power) {
  if (power === 13) return "👑 Tối Thượng";
  if (power >= 11) return "🔥 Mạnh Mẽ";
  if (power >= 8) return "💪 Khá Mạnh";
  if (power >= 5) return "😊 Bình Thường";
  if (power >= 3) return "🌿 Nhẹ Nhàng";
  return "🌱 Thanh Đạm";
}
```

---

### js/particles.js

```javascript
// ============================================================
// PARTICLES.JS — Background Idle Particle System
// ============================================================

class BgParticles {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.raf = null;
    this.isMobile = window.innerWidth < 600;
    this.icons = [
      "🍜",
      "🍛",
      "🥢",
      "🌶️",
      "🧅",
      "🥬",
      "🥩",
      "🍲",
      "🫕",
      "🥗",
      "🍝",
      "🍚",
      "🥚",
      "🧄",
      "🌿",
      "🍅",
    ];
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.isMobile = window.innerWidth < 600;
    this.maxParticles = this.isMobile ? 18 : 30;
  }

  spawnParticle() {
    const size = 16 + Math.random() * 20;
    return {
      x: Math.random() * this.canvas.width,
      y: this.canvas.height + size,
      size,
      icon: this.icons[Math.floor(Math.random() * this.icons.length)],
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(0.4 + Math.random() * 0.8),
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      alpha: 0,
      alphaTarget: 0.1 + Math.random() * 0.18,
      life: 0,
      maxLife: 300 + Math.random() * 200,
    };
  }

  update() {
    if (this.particles.length < this.maxParticles && Math.random() < 0.08)
      this.particles.push(this.spawnParticle());

    this.particles = this.particles.filter((p) => {
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      const fadeIn = Math.min(1, p.life / 60);
      const fadeOut = Math.max(0, 1 - (p.life - p.maxLife + 60) / 60);
      p.alpha = p.alphaTarget * fadeIn * fadeOut;
      return p.life < p.maxLife && p.y > -100;
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Background gradient
    const grad = this.ctx.createRadialGradient(
      this.canvas.width / 2,
      this.canvas.height / 2,
      0,
      this.canvas.width / 2,
      this.canvas.height / 2,
      Math.max(this.canvas.width, this.canvas.height) * 0.7,
    );
    grad.addColorStop(0, "#2d0f00");
    grad.addColorStop(0.5, "#1a0800");
    grad.addColorStop(1, "#0d0300");
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawStars();
    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.font = `${p.size}px serif`;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(p.icon, 0, 0);
      this.ctx.restore();
    }
  }

  drawStars() {
    if (!this._stars) {
      this._stars = [];
      for (let i = 0; i < 80; i++)
        this._stars.push({
          x: Math.random(),
          y: Math.random(),
          r: 0.5 + Math.random() * 1.5,
          twinkle: Math.random() * Math.PI * 2,
          speed: 0.02 + Math.random() * 0.03,
        });
    }
    for (const s of this._stars) {
      s.twinkle += s.speed;
      const alpha = 0.2 + 0.3 * Math.sin(s.twinkle);
      this.ctx.beginPath();
      this.ctx.arc(
        s.x * this.canvas.width,
        s.y * this.canvas.height,
        s.r,
        0,
        Math.PI * 2,
      );
      this.ctx.fillStyle = `rgba(255, 240, 200, ${alpha})`;
      this.ctx.fill();
    }
  }

  start() {
    const loop = () => {
      this.update();
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles = [];
  }
}
```

---

### js/vfx.js

```javascript
// ============================================================
// VFX.JS — Suit-specific Visual Effects
// ============================================================

class SuitVFX {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.raf = null;
    this.suit = null;
    this.time = 0;
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  start(suit) {
    this.suit = suit;
    this.particles = [];
    this.time = 0;
    this.stop();
    const loop = () => {
      this.time++;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      switch (suit) {
        case "HEART":
          this.updateFire();
          this.drawFire();
          break;
        case "SPADE":
          this.updateLightning();
          this.drawLightning();
          break;
        case "DIAMOND":
          this.updateHail();
          this.drawHail();
          break;
        case "CLUB":
          this.updateFlood();
          this.drawFlood();
          break;
      }
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // ── ♥ HEART: Fire ───────────────────────────────────────────
  updateFire() {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    if (this.time % 2 === 0) {
      const angle = Math.random() * Math.PI * 2;
      const r = 90 + Math.random() * 40;
      this.particles.push({
        type: "fire",
        x: cx + Math.cos(angle) * r * 0.6,
        y: cy + Math.sin(angle) * r * 0.85 + 20,
        vx: (Math.random() - 0.5) * 2,
        vy: -(1.5 + Math.random() * 3),
        life: 0,
        maxLife: 40 + Math.random() * 30,
        size: 6 + Math.random() * 14,
      });
    }
    this.particles = this.particles.filter((p) => {
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.vx += (Math.random() - 0.5) * 0.3;
      p.size *= 0.97;
      return p.life < p.maxLife;
    });
  }

  drawFire() {
    for (const p of this.particles) {
      const t = p.life / p.maxLife;
      const alpha = (1 - t) * 0.85;
      let r, g, b;
      if (t < 0.3) {
        r = 255;
        g = 255;
        b = Math.floor(255 * (1 - t / 0.3));
      } else if (t < 0.6) {
        r = 255;
        g = Math.floor(255 * (1 - (t - 0.3) / 0.3));
        b = 0;
      } else {
        r = Math.floor(255 * (1 - (t - 0.6) / 0.4));
        g = 0;
        b = 0;
      }
      const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = grad;
      this.ctx.fill();
    }
  }

  // ── ♠ SPADE: Lightning ──────────────────────────────────────
  updateLightning() {
    if (this.time % 20 === 0)
      this.particles.push({
        type: "bolt",
        life: 0,
        maxLife: 15,
        x: (0.1 + Math.random() * 0.8) * this.canvas.width,
      });
    if (this.time % 3 === 0) {
      const cx = this.canvas.width / 2,
        cy = this.canvas.height / 2;
      this.particles.push({
        type: "spark",
        x: cx + (Math.random() - 0.5) * 120,
        y: cy + (Math.random() - 0.5) * 160,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        life: 0,
        maxLife: 25 + Math.random() * 15,
      });
    }
    this.particles = this.particles.filter((p) => {
      p.life++;
      if (p.type === "spark") {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.9;
        p.vy += 0.1;
      }
      return p.life < p.maxLife;
    });
  }

  drawLightning() {
    for (const p of this.particles) {
      if (p.type === "bolt") {
        this.drawBolt(
          p.x,
          0,
          p.x + (Math.random() - 0.5) * 60,
          this.canvas.height * 0.6,
          6,
        );
        if (p.life < 3) {
          this.ctx.fillStyle = `rgba(200,220,255,${0.15 * (3 - p.life)})`;
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
      } else if (p.type === "spark") {
        const t = p.life / p.maxLife;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, 2 * (1 - t), 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(180,200,255,${(1 - t) * 0.9})`;
        this.ctx.fill();
      }
    }
  }

  drawBolt(x1, y1, x2, y2, depth) {
    if (depth <= 0) return;
    const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * (depth * 8);
    const my = (y1 + y2) / 2 + (Math.random() - 0.5) * (depth * 2);
    const alpha = Math.min(1, depth / 4);
    this.ctx.strokeStyle =
      depth > 4
        ? `rgba(255,255,255,${alpha})`
        : `rgba(150,180,255,${alpha * 0.7})`;
    this.ctx.lineWidth = depth > 4 ? 2 : 1;
    this.ctx.shadowColor = "#aaccff";
    this.ctx.shadowBlur = 8;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(mx, my);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
    if (Math.random() < 0.4)
      this.drawBolt(
        mx,
        my,
        mx + (Math.random() - 0.5) * 80,
        my + 50,
        depth - 2,
      );
    this.drawBolt(x1, y1, mx, my, depth - 1);
    this.drawBolt(mx, my, x2, y2, depth - 1);
  }

  // ── ♦ DIAMOND: Hail ─────────────────────────────────────────
  updateHail() {
    if (this.time % 2 === 0)
      this.particles.push({
        type: "hail",
        x: Math.random() * this.canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 1.5 + 1,
        vy: 4 + Math.random() * 4,
        r: 3 + Math.random() * 7,
        life: 0,
        maxLife: 120,
        bounced: false,
      });
    this.particles = this.particles.filter((p) => {
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      if (!p.bounced && p.y > this.canvas.height * 0.8) {
        p.vy = -p.vy * 0.4;
        p.bounced = true;
      }
      return p.life < p.maxLife && p.y < this.canvas.height + 50;
    });
  }

  drawHail() {
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    grad.addColorStop(0, "rgba(168,216,234,0.05)");
    grad.addColorStop(1, "rgba(100,160,200,0.1)");
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    for (const p of this.particles) {
      const t = p.life / p.maxLife;
      const alpha = (1 - t) * 0.85;
      const g = this.ctx.createRadialGradient(
        p.x - p.r * 0.3,
        p.y - p.r * 0.3,
        0,
        p.x,
        p.y,
        p.r,
      );
      g.addColorStop(0, `rgba(240,255,255,${alpha})`);
      g.addColorStop(0.5, `rgba(168,216,234,${alpha * 0.8})`);
      g.addColorStop(1, `rgba(80,140,180,${alpha * 0.4})`);
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fillStyle = g;
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(
        p.x - p.r * 0.3,
        p.y - p.r * 0.3,
        p.r * 0.25,
        0,
        Math.PI * 2,
      );
      this.ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`;
      this.ctx.fill();
    }
  }

  // ── ♣ CLUB: Flood ───────────────────────────────────────────
  updateFlood() {
    if (this.time % 2 === 0)
      this.particles.push({
        type: "drop",
        x: Math.random() * this.canvas.width,
        y: -(Math.random() * 100),
        vx: (Math.random() - 0.5) * 1,
        vy: 5 + Math.random() * 4,
        r: 2 + Math.random() * 5,
        life: 0,
        maxLife: 100,
      });
    if (this.time % 15 === 0)
      this.particles.push({
        type: "ripple",
        x: Math.random() * this.canvas.width,
        y: this.canvas.height * 0.75 + Math.random() * 50,
        r: 5,
        life: 0,
        maxLife: 60,
      });
    this.particles = this.particles.filter((p) => {
      p.life++;
      if (p.type === "drop") {
        p.x += p.vx;
        p.y += p.vy;
      }
      if (p.type === "ripple") {
        p.r += 3;
      }
      return p.life < p.maxLife;
    });
  }

  drawFlood() {
    const W = this.canvas.width,
      H = this.canvas.height;
    const base = H * 0.72;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 4) {
      const y =
        base +
        Math.sin(x * 0.015 + this.time * 0.05) * 12 +
        Math.sin(x * 0.03 + this.time * 0.08) * 6;
      this.ctx.lineTo(x, y);
    }
    this.ctx.lineTo(W, H);
    this.ctx.closePath();
    const wg = this.ctx.createLinearGradient(0, base, 0, H);
    wg.addColorStop(0, "rgba(30,100,160,0.55)");
    wg.addColorStop(1, "rgba(10,50,100,0.4)");
    this.ctx.fillStyle = wg;
    this.ctx.fill();
    this.ctx.restore();
    for (const p of this.particles) {
      const t = p.life / p.maxLife;
      const alpha = (1 - t) * 0.8;
      if (p.type === "drop") {
        this.ctx.beginPath();
        this.ctx.ellipse(p.x, p.y, p.r * 0.4, p.r, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(100,180,240,${alpha})`;
        this.ctx.fill();
      } else if (p.type === "ripple") {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(100,200,255,${(1 - t) * 0.5})`;
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
      }
    }
  }
}
```

---

### js/main.js

```javascript
// ============================================================
// MAIN.JS — App State Machine & Orchestration
// ============================================================

(function () {
  "use strict";

  const STATE = { IDLE: "idle", DRAWING: "drawing", REVEAL: "reveal" };
  let currentState = STATE.IDLE;
  let currentCard = null;

  const screens = {
    idle: document.getElementById("screen-idle"),
    drawing: document.getElementById("screen-drawing"),
    reveal: document.getElementById("screen-reveal"),
  };
  const ctaBtn = document.getElementById("ctaBtn");
  const btnRetry = document.getElementById("btnRetry");
  const btnShare = document.getElementById("btnShare");
  const drawingText = document.getElementById("drawingText");
  const drawingCount = document.getElementById("drawingCountdown");
  const drawingCanvas = document.getElementById("drawingCanvas");
  const revealCanvas = document.getElementById("revealCanvas");
  const bgCanvas = document.getElementById("bgCanvas");

  const bgParticles = new BgParticles(bgCanvas);
  const suitVFX = new SuitVFX(revealCanvas);
  let drawingCtx = drawingCanvas.getContext("2d");
  let drawingAnim = null;
  let flyCards = [];

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    resizeCanvas(drawingCanvas);
    resizeCanvas(revealCanvas);
    window.addEventListener("resize", () => {
      resizeCanvas(drawingCanvas);
      resizeCanvas(revealCanvas);
    });
    bgParticles.start();
    animateIdleDeck();
    ctaBtn.addEventListener("click", onCtaClick);
    btnRetry.addEventListener("click", onRetryClick);
    btnShare.addEventListener("click", onShareClick);
  }

  function resizeCanvas(c) {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  }

  function goTo(state) {
    Object.values(screens).forEach((s) => s.classList.remove("active"));
    screens[state].classList.add("active");
    currentState = state;
  }

  // ── Idle Deck Float ──────────────────────────────────────────
  function animateIdleDeck() {
    if (typeof gsap === "undefined") return;
    // Animate whole wrapper (not individual cards) to preserve CSS rotations
    const wrapper = document.querySelector(".deck-wrapper");
    if (wrapper)
      gsap.to(wrapper, {
        y: -10,
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
  }

  // ── CTA Click ─────────────────────────────────────────────────
  function onCtaClick() {
    if (currentState !== STATE.IDLE) return;
    if (navigator.vibrate) navigator.vibrate([50, 30, 100]);
    currentCard = getRandomCard();
    if (typeof gsap !== "undefined") {
      gsap.to(ctaBtn, {
        scale: 0,
        duration: 0.3,
        ease: "back.in(2)",
        onComplete: startDrawingSequence,
      });
    } else {
      startDrawingSequence();
    }
  }

  // ── Drawing (5 seconds) ──────────────────────────────────────
  function startDrawingSequence() {
    goTo(STATE.DRAWING);
    resizeCanvas(drawingCanvas);
    flyCards = [];
    const W = drawingCanvas.width,
      H = drawingCanvas.height;
    const cx = W / 2,
      cy = H / 2;

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      flyCards.push({
        x: cx,
        y: cy,
        tx: cx + Math.cos(angle) * W * 0.4,
        ty: cy + Math.sin(angle) * H * 0.35,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        w: 60,
        h: 85,
        color: `hsl(${Math.random() * 30 + 5},80%,${20 + Math.random() * 20}%)`,
      });
    }

    let elapsed = 0;
    const totalMs = 5000;
    let lastTime = performance.now();
    let shakeX = 0,
      shakeY = 0;
    const MESSAGES = [
      { t: 0, txt: "Xáo bài..." },
      { t: 1500, txt: "Đang chọn lọc..." },
      { t: 2800, txt: "Số phận đã định..." },
      { t: 4000, txt: "SẮP RA RỒI!" },
    ];
    let msgIdx = 0;
    drawingText.textContent = MESSAGES[0].txt;
    drawingCount.textContent = "";

    function loop(now) {
      const dt = now - lastTime;
      lastTime = now;
      elapsed += dt;
      const progress = Math.min(elapsed / totalMs, 1);

      while (
        msgIdx + 1 < MESSAGES.length &&
        elapsed >= MESSAGES[msgIdx + 1].t
      ) {
        msgIdx++;
        drawingText.textContent = MESSAGES[msgIdx].txt;
        if (msgIdx === MESSAGES.length - 1 && navigator.vibrate)
          navigator.vibrate([100, 50, 200]);
      }
      if (elapsed > 2000) {
        const remaining = Math.ceil((totalMs - elapsed) / 1000);
        drawingCount.textContent = remaining > 0 ? remaining : "";
      }

      if (progress > 0.7) {
        const intensity = ((progress - 0.7) / 0.3) * 8;
        shakeX = (Math.random() - 0.5) * intensity;
        shakeY = (Math.random() - 0.5) * intensity;
      } else {
        shakeX = 0;
        shakeY = 0;
      }

      flyCards.forEach((c, i) => {
        if (progress < 0.2) {
          c.x += (c.tx - c.x) * 0.08;
          c.y += (c.ty - c.y) * 0.08;
        } else if (progress < 0.7) {
          const orbitAngle = (i / 8) * Math.PI * 2 + progress * 6;
          const orbitR =
            Math.min(W, H) * 0.3 * (1 - ((progress - 0.2) / 0.5) * 0.3);
          c.x += (cx + Math.cos(orbitAngle) * orbitR * 0.7 - c.x) * 0.1;
          c.y += (cy + Math.sin(orbitAngle) * orbitR * 0.5 - c.y) * 0.1;
        } else {
          c.x += (cx - c.x) * 0.15;
          c.y += (cy - c.y) * 0.15;
        }
        c.rotation += c.rotSpeed * (1 + progress * 3);
      });

      const dctx = drawingCtx;
      dctx.save();
      dctx.clearRect(0, 0, W, H);
      const bg = dctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H));
      bg.addColorStop(0, `hsl(${15 + progress * 20},80%,${5 + progress * 8}%)`);
      bg.addColorStop(1, "#000");
      dctx.fillStyle = bg;
      dctx.fillRect(0, 0, W, H);
      const ring = dctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        120 + progress * 80,
      );
      ring.addColorStop(0, `rgba(255,150,50,${0.1 + progress * 0.3})`);
      ring.addColorStop(1, "transparent");
      dctx.fillStyle = ring;
      dctx.fillRect(0, 0, W, H);
      dctx.translate(shakeX, shakeY);
      flyCards.forEach((c) => {
        dctx.save();
        dctx.translate(c.x, c.y);
        dctx.rotate(c.rotation);
        const w = c.w * (0.8 + progress * 0.5),
          h = c.h * (0.8 + progress * 0.5);
        dctx.shadowColor = "rgba(255,100,0,0.4)";
        dctx.shadowBlur = 15;
        roundRect(dctx, -w / 2, -h / 2, w, h, 6);
        dctx.fillStyle = c.color;
        dctx.fill();
        dctx.strokeStyle = "rgba(255,215,0,0.5)";
        dctx.lineWidth = 1.5;
        dctx.stroke();
        dctx.shadowBlur = 0;
        dctx.font = `${w * 0.4}px serif`;
        dctx.textAlign = "center";
        dctx.textBaseline = "middle";
        dctx.globalAlpha = 0.2;
        dctx.fillStyle = "#FFD700";
        dctx.fillText("🍜", 0, 0);
        dctx.globalAlpha = 1;
        dctx.restore();
      });
      if (progress > 0.92) {
        dctx.fillStyle = `rgba(255,220,100,${((progress - 0.92) / 0.08) * 0.8})`;
        dctx.fillRect(0, 0, W, H);
      }
      dctx.restore();

      if (progress < 1) {
        drawingAnim = requestAnimationFrame(loop);
      } else {
        drawingCount.textContent = "";
        startReveal();
      }
    }
    drawingAnim = requestAnimationFrame(loop);
  }

  // ── Reveal ───────────────────────────────────────────────────
  function startReveal() {
    goTo(STATE.REVEAL);
    resizeCanvas(revealCanvas);
    const card = currentCard;
    const suit = SUITS[card.suit];
    screens.reveal.className = "screen active reveal-bg-" + suit.cls;
    buildRevealCard(card, suit);
    suitVFX.start(card.suit);

    const label = document.querySelector(".reveal-label");
    const revCard = document.getElementById("revealedCard");
    const powerBar = document.querySelector(".power-bar");
    const revBtns = document.querySelector(".reveal-buttons");

    label.style.opacity = "0";
    powerBar.style.opacity = "0";
    revBtns.style.opacity = "0";
    if (typeof gsap !== "undefined") gsap.set(ctaBtn, { scale: 1 });

    if (typeof gsap !== "undefined") {
      const tl = gsap.timeline();
      tl.fromTo(
        revCard,
        { scale: 0, rotation: -15, opacity: 0 },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.7,
          ease: "back.out(1.8)",
          delay: 0.2,
        },
      )
        .to(label, { opacity: 1, duration: 0.4 }, "-=0.1")
        .to(
          revCard,
          {
            scale: 1.1,
            duration: 0.15,
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
          },
          "+=0.1",
        )
        .to(powerBar, { opacity: 1, duration: 0.4 }, "+=0.15")
        .to(revBtns, { opacity: 1, duration: 0.4 }, "+=0.1");
      if (navigator.vibrate) navigator.vibrate([50, 50, 200]);
    } else {
      label.style.opacity = "1";
      powerBar.style.opacity = "1";
      revBtns.style.opacity = "1";
    }
  }

  function buildRevealCard(card, suit) {
    const colorCls = suit.colorCls;
    const face = document.getElementById("cardFront");
    face.className = "card-face card-front " + suit.cls;

    document.getElementById("rankTop").textContent = card.rank;
    document.getElementById("rankTop").className = "card-rank-top " + colorCls;
    document.getElementById("suitTop").textContent = suit.symbol;
    document.getElementById("suitTop").className = "card-suit-top " + colorCls;

    // Support AI images if available
    const foodEl = document.getElementById("foodIcon");
    if (card.img) {
      foodEl.innerHTML = `<img src="${card.img}" alt="${card.food}"
      style="width:100%;height:100%;object-fit:contain;">`;
    } else {
      foodEl.textContent = card.emoji;
    }

    document.getElementById("foodName").textContent = card.food;
    document.getElementById("foodDesc").textContent = card.desc;
    document.getElementById("rankBot").textContent = card.rank;
    document.getElementById("rankBot").className = "card-rank-bot " + colorCls;
    document.getElementById("suitBot").textContent = suit.symbol;
    document.getElementById("suitBot").className = "card-suit-bot " + colorCls;
    document.getElementById("revealLabel").textContent = "Hôm nay bạn sẽ ăn...";
    document.getElementById("powerStars").textContent = getPowerStars(
      card.power,
    );
    document.querySelector(".power-label").textContent =
      getPowerLabel(card.power) + ":";
  }

  // ── Retry ─────────────────────────────────────────────────────
  function onRetryClick() {
    if (navigator.vibrate) navigator.vibrate([30]);
    suitVFX.stop();
    screens.reveal.className = "screen";
    if (typeof gsap !== "undefined") {
      const revCard = document.getElementById("revealedCard");
      gsap.to(revCard, {
        scale: 0,
        rotation: -360,
        duration: 0.5,
        ease: "back.in(2)",
        onComplete: goToIdle,
      });
    } else {
      goToIdle();
    }
  }

  function goToIdle() {
    goTo(STATE.IDLE);
    currentCard = null;
    if (typeof gsap !== "undefined") {
      gsap.set(document.getElementById("revealedCard"), {
        scale: 1,
        rotation: 0,
        opacity: 1,
      });
      gsap.set(ctaBtn, { scale: 1 });
    }
  }

  // ── Share ─────────────────────────────────────────────────────
  function onShareClick() {
    if (!currentCard) return;
    const card = currentCard;
    const suit = SUITS[card.suit];
    const text = `🎴 Hôm nay tôi ăn: ${card.food} ${card.emoji}\n${suit.symbol} ${card.rank} — ${getPowerLabel(card.power)}\n\nRút bài xem hôm nay ăn gì! 🍜`;
    if (navigator.share) {
      navigator
        .share({ title: "Hôm Nay Ăn Gì?", text })
        .catch(() => copyToClipboard(text));
    } else {
      copyToClipboard(text);
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById("btnShare");
      const orig = btn.textContent;
      btn.textContent = "✅ Đã chép!";
      setTimeout(() => (btn.textContent = orig), 2000);
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

  document.addEventListener("DOMContentLoaded", init);
  if (document.readyState !== "loading") init();
})();
```

---

## 7. Hệ Thống Dữ Liệu 52 Lá Bài

### Cấu trúc một card object

```javascript
{
  suit:  'HEART',        // 'HEART' | 'SPADE' | 'DIAMOND' | 'CLUB'
  rank:  'A',            // 'A','K','Q','J','10','9','8','7','6','5','4','3','2'
  power: 13,             // 1–13, dùng cho getPowerStars()
  food:  'Phở Bò',       // Tên hiển thị trên bài
  emoji: '🍜',           // Fallback khi chưa có ảnh AI
  desc:  '...',          // Mô tả ngắn gợi cảm giác món ăn
  img:   'assets/images/pho-bo.png',  // (optional) Ảnh AI gen
}
```

### Power Ranking

| Power | Label          | Ranks    |
| ----- | -------------- | -------- |
| 13    | 👑 Tối Thượng  | A        |
| 11–12 | 🔥 Mạnh Mẽ     | K, Q     |
| 8–10  | 💪 Khá Mạnh    | J, 10, 9 |
| 5–7   | 😊 Bình Thường | 8, 7, 6  |
| 3–4   | 🌿 Nhẹ Nhàng   | 5, 4     |
| 1–2   | 🌱 Thanh Đạm   | 3, 2     |

### Đại Diện 4 Suit

| Suit    | Ký hiệu | Ace        | VFX         | Màu       |
| ------- | ------- | ---------- | ----------- | --------- |
| Heart   | ♥       | Phở Bò 🍜  | Lửa cháy 🔥 | `#CC0000` |
| Spade   | ♠       | Cơm Tấm 🍛 | Sét đánh ⚡ | `#0A1628` |
| Diamond | ♦       | Bánh Mỳ 🥖 | Mưa đá 🌨️   | `#0066AA` |
| Club    | ♣       | Hủ Tiếu 🍝 | Lũ cuốn 🌊  | `#006622` |

---

## 8. Animation Chi Tiết

### Idle State

| Element        | Animation                        | Thông số                                            |
| -------------- | -------------------------------- | --------------------------------------------------- |
| Title chars    | `titleDrop` keyframe             | 0.7s, cubic-bezier(0.34,1.56,0.64,1), stagger 0.12s |
| Subtitle       | `fadeInDown` keyframe            | 1s ease                                             |
| Deck wrapper   | GSAP `y: -10`                    | 2.2s, sine.inOut, yoyo, repeat -1                   |
| Glow dưới deck | `glowPulse` keyframe             | 2s ease-in-out, infinite                            |
| CTA shimmer    | `shimmer` keyframe (::before)    | 2.5s loop                                           |
| CTA pulse      | `ctaPulse` keyframe (box-shadow) | 2s loop                                             |

### Drawing State (5000ms)

```
0%    → Cards scatter ra 8 hướng (lerp 8%/frame)
20%   → Cards orbit (sin/cos + radius giảm dần)
70%   → Cards gather về center (lerp 15%/frame)
70%+  → Screen shake tăng dần ±8px
92%+  → Flash vàng overlay fade in
100%  → startReveal()
```

Messages: `0ms` "Xáo bài..." → `1500ms` "Đang chọn lọc..." → `2800ms` "Số phận đã định..." → `4000ms` "SẮP RA RỒI!"

### Reveal State (GSAP Timeline)

```
+0.2s  Card fromTo: scale(0,rot-15°) → scale(1,rot0°), 0.7s, back.out(1.8)
+0.3s  Label opacity 0→1, 0.4s
+0.5s  Card bounce: scale 1→1.1→1, 0.15s×2
+0.7s  PowerBar opacity 0→1, 0.4s
+0.9s  Buttons opacity 0→1, 0.4s
```

---

## 9. VFX Theo Suit

### ♥ Heart — Fire

- **Particle**: spawn 1 mỗi 2 frames từ cạnh card, radius 90–130px
- **Velocity**: vx ±1, vy -1.5 đến -4.5
- **Màu lifecycle**: white → yellow → orange → red
- **Render**: radialGradient fade, size \*= 0.97/frame
- **Max concurrent**: ~60 particles

### ♠ Spade — Lightning

- **Bolt**: mỗi 20 frames, thuật toán recursive midpoint displacement depth=6
- **Branch**: 40% probability tại mỗi midpoint
- **Flash**: white overlay 15% opacity 3 frames đầu
- **Spark**: 1 mỗi 3 frames, ±60×80px từ center, gravity 0.1, friction 0.9

### ♦ Diamond — Hail

- **Hailstone**: 1 mỗi 2 frames, size r=3–10px
- **Trajectory**: vx ±0.75+1 (wind), vy 4–8
- **Bounce**: tại y>80%H, vy = -vy × 0.4
- **Render**: 3-stop radial ice gradient + shine dot tại (-0.3r, -0.3r)
- **Overlay**: frost linear gradient 5–10%

### ♣ Club — Flood

- **Wave**: sine curve với 2 frequencies (0.015 + 0.030), base y=72%H
- **Amplitude**: ±12px + ±6px
- **Drop**: ellipse (rx=0.4r, ry=r) rơi từ trên
- **Ripple**: mỗi 15 frames, r tăng 3px/frame, stroke fade out

---

## 10. Tích Hợp Hình Ảnh AI

Khi có đủ 52 ảnh PNG từ AI generation, thêm trường `img` vào data và update `buildRevealCard()`:

### Bước 1 — Thêm vào data.js

```javascript
{ suit:'HEART', rank:'A', power:13, food:'Phở Bò', emoji:'🍜',
  img: 'assets/images/pho-bo.png',           // ← thêm dòng này
  desc: '...' },
```

### Bước 2 — buildRevealCard() đã sẵn sàng

`main.js` đã có logic xử lý `card.img`:

```javascript
const foodEl = document.getElementById("foodIcon");
if (card.img) {
  foodEl.innerHTML = `<img src="${card.img}" alt="${card.food}"
    style="width:100%;height:100%;object-fit:contain;">`;
} else {
  foodEl.textContent = card.emoji; // fallback nếu chưa có ảnh
}
```

### Bước 3 — CSS cho food image

Thêm vào `main.css`:

```css
.card-center-food img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
  /* Tắt bounce nếu dùng ảnh thật */
  animation: none;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25));
}
```

### Naming convention cho file ảnh

| Món        | Filename         |
| ---------- | ---------------- |
| Phở Bò     | `pho-bo.png`     |
| Cơm Tấm    | `com-tam.png`    |
| Bánh Mỳ    | `banh-my.png`    |
| Hủ Tiếu    | `hu-tieu.png`    |
| Bún Bò Huế | `bun-bo-hue.png` |
| …          | …                |

---

## 11. AI Image Prompts

### Base Style (thêm vào cuối mỗi prompt)

```
isometric flat illustration, vibrant food art, Vietnamese street food style,
warm amber and orange color palette, soft drop shadow, centered composition,
isolated on transparent background, no text, no watermark,
1:1 square format, high quality digital illustration
```

### Prompts Hàng Ace

**Phở Bò (♥A)**

```
A steaming bowl of Vietnamese pho beef noodle soup, tender sliced beef, fresh herbs
(basil, bean sprouts, lime), chopsticks resting on rim, swirling steam rising, rich
brown broth glistening, rice noodles visible beneath, small side plate with chili and
hoisin sauce, [BASE STYLE]
```

**Cơm Tấm (♠A)**

```
Vietnamese broken rice plate (com tam), grilled pork chop with char marks, shredded
pork skin (bi), steamed egg meatloaf (cha trung), sunny-side-up fried egg, small bowl
of fish sauce dipping, fresh cucumber slices, spring onion oil drizzled, plate viewed
from slight angle, [BASE STYLE]
```

**Bánh Mỳ (♦A)**

```
Vietnamese banh mi baguette sandwich cut diagonally, crispy golden crust, overflowing
fillings: pate, cold cuts, pickled daikon and carrot, fresh cucumber, cilantro, sliced
chili, sesame sprinkled on top, steam rising from fresh-baked bread, [BASE STYLE]
```

**Hủ Tiếu (♣A)**

```
Vietnamese hu tieu noodle soup bowl, clear golden broth, thin rice noodles, minced pork,
whole shrimp, sliced pork, fresh green onions and cilantro garnish, small dish of bean
sprouts and lime on side, elegant bowl with blue ceramic pattern, [BASE STYLE]
```

### Prompts Hàng K-Q

**Bún Bò Huế**: `Spicy Vietnamese bun bo Hue soup, thick round rice noodles, sliced beef shank, pork knuckle, congealed pork blood cubes, lemongrass broth deep red-orange color, fresh herb plate alongside, rustic clay bowl, steam wisps, [BASE STYLE]`

**Cơm Rang**: `Vietnamese fried rice (com rang) in wok presentation, golden rice grains glistening, visible egg pieces, spring onions, colorful vegetables (carrot, peas, corn), wok-charred aroma implied by light smoke, [BASE STYLE]`

**Bánh Cuốn**: `Vietnamese rice rolls (banh cuon), thin translucent rice sheets, filled with seasoned ground pork and wood ear mushrooms, topped with crispy fried shallots, served with Vietnamese ham (cha lua), small bowl of sweet fish sauce, [BASE STYLE]`

**Mì Quảng**: `Vietnamese Quang-style noodles (mi quang), thick yellow turmeric noodles, braised pork and shrimp, topped with toasted sesame rice cracker, fresh herbs, roasted peanuts, banana blossom shreds, [BASE STYLE]`

**Bún Riêu**: `Vietnamese bun rieu crab noodle soup, tomato-based broth bright red-orange, crab paste dumplings, tofu, Vietnamese ham, rice vermicelli noodles, fresh herb garnish, [BASE STYLE]`

**Cao Lầu**: `Vietnamese Cao Lau Hoi An noodles, thick chewy noodles, braised pork char siu style, crispy rice crackers, fresh herbs, bean sprouts, minimal broth, [BASE STYLE]`

### Tips Tinh Chỉnh Prompt

- Ảnh quá phức tạp → thêm `"simple, minimal, clean, 2D flat"`
- Màu sai → thêm `"no blue tones, warm colors only, orange dominant"`
- Không giống ẩm thực Việt → thêm `"authentic Vietnamese, Ho Chi Minh City street food, Saigon style"`
- Background không trong → thêm `"pure white background, isolated subject"`
- Midjourney: thêm `--ar 1:1 --style raw --v 6` vào cuối
- Dùng `--sref` (style reference) sau khi có 1 ảnh đẹp để đồng nhất phong cách

### Công Cụ Khuyên Dùng

| Rank | Tool             | Điểm mạnh                                |
| ---- | ---------------- | ---------------------------------------- |
| 1    | Midjourney v6    | Chất lượng cao nhất                      |
| 2    | Adobe Firefly    | Transparent bg native, an toàn bản quyền |
| 3    | DALL-E 3         | Dễ dùng, hiểu tiếng Việt                 |
| 4    | Ideogram 2.0     | Free tier, flat illustration             |
| 5    | Stable Diffusion | Free/local, customize tối đa             |

**Xử lý transparent background**: dùng [remove.bg](https://remove.bg) (free 5 ảnh/ngày) hoặc Adobe Firefly built-in.

---

## 12. Roadmap Phát Triển

### v1.0 ✅ (Hiện tại)

- [x] 52 lá bài với emoji, tên, mô tả, power score
- [x] Idle: background particles + deck float + CTA pulse
- [x] Drawing: 5s animation sequence với flying cards + screen shake
- [x] Reveal: 4 suit VFX (fire/lightning/hail/flood)
- [x] GSAP reveal animation (scale-in, no flip)
- [x] Deck canh giữa màn hình (fix bug CSS transform conflict)
- [x] Web Share API + clipboard fallback
- [x] Haptic feedback (Vibration API)
- [x] Responsive mobile-first

### v1.1 — Assets

- [ ] 52 ảnh PNG món ăn từ AI generation (Midjourney/Firefly)
- [ ] Sound effects (9 files MP3) + Howler.js integration
- [ ] Favicon PNG 32×32 + 180×180

### v1.2 — PWA & Polish

- [ ] `manifest.json` → installable PWA
- [ ] Service Worker → offline support
- [ ] OG meta tags → rich social sharing preview
- [ ] Loading screen với animation khi tải Google Fonts
- [ ] `prefers-reduced-motion` → disable animations

### v1.3 — Features

- [ ] **Bộ lọc bữa ăn**: chọn Sáng/Trưa/Tối trước khi rút → subset cards phù hợp
- [ ] **Confetti burst** khi rút được Ace (🎊)
- [ ] **Lịch sử**: localStorage lưu 5 lần rút gần nhất
- [ ] **Thống kê**: biểu đồ suit đã rút nhiều nhất
- [ ] **Dark/Light mode** toggle

### v2.0 — Multi-player / Social

- [ ] Chế độ rút cho nhiều người (party mode)
- [ ] Bình chọn: sau khi ăn rate món đó (👍/👎)
- [ ] Gợi ý nhà hàng gần nhất cho món được rút (Google Maps API)
- [ ] Custom deck: người dùng tự thêm món ăn

---

## 13. Hướng Dẫn Deploy

### Chạy Local

```bash
# Cách 1: Mở thẳng file (không cần server)
open food-card/index.html

# Cách 2: Local server (nếu cần HTTPS cho Web Share API)
cd food-card
python3 -m http.server 8080
# Truy cập: http://localhost:8080
```

### Deploy Netlify (Khuyên dùng)

```bash
# Drag & drop tại: netlify.com/drop
# Hoặc dùng CLI:
npm install -g netlify-cli
netlify deploy --prod --dir food-card/
```

### Deploy GitHub Pages

```bash
git init && git add . && git commit -m "init"
git remote add origin https://github.com/username/homnay-an-gi.git
git push -u origin main
# Settings → Pages → Deploy from main branch
```

### Deploy Vercel

```bash
npm install -g vercel
cd food-card && vercel --prod
```

### Environment Notes

- Không cần Node.js, npm, hay build step nào
- Web Share API chỉ hoạt động trên HTTPS (không phải `file://`)
- Vibration API chỉ có trên Android (không có trên iOS Safari)
- Google Fonts cần internet connection (cache sau lần đầu)

---

## 14. Changelog

### v1.1 (Current)

- **Fix**: Deck bài không còn lệch sang một bên — nguyên nhân GSAP `y: '-=6'` trên từng card override CSS `transform` (vốn chứa `rotate`). Fix bằng cách animate cả `.deck-wrapper` thay vì từng card.
- **Fix**: Màn hình reveal không còn lật úp bài — đã bỏ hoàn toàn cơ chế 3D flip (`perspective`, `rotateY`, `.flipped` class). Card hiện thẳng mặt trước với GSAP `scale + rotation` entry animation.
- **Add**: `buildRevealCard()` hỗ trợ `card.img` để swap emoji → ảnh AI PNG khi có.
- **Add**: AI image prompts đầy đủ cho 52 món ăn.

### v1.0

- Khởi tạo dự án
- 52 lá bài data hoàn chỉnh
- 3 screens: Idle → Drawing → Reveal
- 4 VFX theo suit
- Responsive mobile-first

---

_Made with ❤️ for Vietnamese foodies — "Hôm nay ăn gì?" không còn là câu hỏi khó nữa! 🍜_
