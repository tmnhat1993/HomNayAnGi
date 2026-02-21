// ============================================================
// VFX.JS — Suit-specific Visual Effects
// ============================================================

export class SuitVFX {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.raf = null;
    this.suit = null;
    this.time = 0;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width  = window.innerWidth;
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
        case 'HEART':   this.updateFire();      this.drawFire();      break;
        case 'SPADE':   this.updateLightning(); this.drawLightning(); break;
        case 'DIAMOND': this.updateHail();      this.drawHail();      break;
        case 'CLUB':    this.updateFlood();     this.drawFlood();     break;
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

  // ── HEART: Fire ─────────────────────────────────────────────
  updateFire() {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;

    // Spawn fire particles from card edges
    if (this.time % 2 === 0) {
      const angle = Math.random() * Math.PI * 2;
      const r = 90 + Math.random() * 40;
      this.particles.push({
        type: 'fire',
        x: cx + Math.cos(angle) * r * 0.6,
        y: cy + Math.sin(angle) * r * 0.85 + 20,
        vx: (Math.random() - 0.5) * 2,
        vy: -(1.5 + Math.random() * 3),
        life: 0,
        maxLife: 40 + Math.random() * 30,
        size: 6 + Math.random() * 14,
      });
    }

    this.particles = this.particles.filter(p => {
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
      // Color: white -> yellow -> orange -> red
      let r, g, b;
      if (t < 0.3)      { r=255; g=255; b=Math.floor(255*(1-t/0.3)); }
      else if (t < 0.6) { r=255; g=Math.floor(255*(1-(t-0.3)/0.3)); b=0; }
      else               { r=Math.floor(255*(1-(t-0.6)/0.4)); g=0; b=0; }

      const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = grad;
      this.ctx.fill();
    }
  }

  // ── SPADE: Lightning ─────────────────────────────────────────
  updateLightning() {
    // Spawn bolt every 20 frames
    if (this.time % 20 === 0) {
      this.particles.push({
        type: 'bolt',
        life: 0,
        maxLife: 15,
        x: (0.1 + Math.random() * 0.8) * this.canvas.width,
      });
    }
    // Sparks
    if (this.time % 3 === 0) {
      const cx = this.canvas.width / 2;
      const cy = this.canvas.height / 2;
      this.particles.push({
        type: 'spark',
        x: cx + (Math.random()-0.5)*120,
        y: cy + (Math.random()-0.5)*160,
        vx: (Math.random()-0.5)*5,
        vy: (Math.random()-0.5)*5,
        life: 0,
        maxLife: 25 + Math.random()*15,
      });
    }

    this.particles = this.particles.filter(p => {
      p.life++;
      if (p.type === 'spark') { p.x += p.vx; p.y += p.vy; p.vx *= 0.9; p.vy += 0.1; }
      return p.life < p.maxLife;
    });
  }

  drawLightning() {
    for (const p of this.particles) {
      if (p.type === 'bolt') {
        this.drawBolt(p.x, 0, p.x + (Math.random()-0.5)*60, this.canvas.height * 0.6, 6);
        // Flash
        if (p.life < 3) {
          this.ctx.fillStyle = `rgba(200,220,255,${0.15*(3-p.life)})`;
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
      } else if (p.type === 'spark') {
        const t = p.life / p.maxLife;
        const a = (1-t) * 0.9;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, 2*(1-t), 0, Math.PI*2);
        this.ctx.fillStyle = `rgba(180,200,255,${a})`;
        this.ctx.fill();
      }
    }
  }

  drawBolt(x1, y1, x2, y2, depth) {
    if (depth <= 0) return;
    const mx = (x1+x2)/2 + (Math.random()-0.5)*(depth*8);
    const my = (y1+y2)/2 + (Math.random()-0.5)*(depth*2);

    const alpha = Math.min(1, depth/4);
    this.ctx.strokeStyle = depth > 4
      ? `rgba(255,255,255,${alpha})`
      : `rgba(150,180,255,${alpha*0.7})`;
    this.ctx.lineWidth = depth > 4 ? 2 : 1;
    this.ctx.shadowColor = '#aaccff';
    this.ctx.shadowBlur = 8;

    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(mx, my);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;

    if (Math.random() < 0.4) {
      this.drawBolt(mx, my, mx + (Math.random()-0.5)*80, my + 50, depth-2);
    }
    this.drawBolt(x1, y1, mx, my, depth-1);
    this.drawBolt(mx, my, x2, y2, depth-1);
  }

  // ── DIAMOND: Hail ────────────────────────────────────────────
  updateHail() {
    if (this.time % 2 === 0) {
      this.particles.push({
        type: 'hail',
        x: Math.random() * this.canvas.width,
        y: -10,
        vx: (Math.random()-0.5)*1.5 + 1,
        vy: 4 + Math.random() * 4,
        r: 3 + Math.random() * 7,
        life: 0,
        maxLife: 120,
        bounced: false,
      });
    }

    this.particles = this.particles.filter(p => {
      p.life++;
      p.x += p.vx; p.y += p.vy;
      if (!p.bounced && p.y > this.canvas.height * 0.8) {
        p.vy = -p.vy * 0.4;
        p.bounced = true;
      }
      return p.life < p.maxLife && p.y < this.canvas.height + 50;
    });
  }

  drawHail() {
    // Frost overlay
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    grad.addColorStop(0, 'rgba(168,216,234,0.05)');
    grad.addColorStop(1, 'rgba(100,160,200,0.1)');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (const p of this.particles) {
      const t = p.life / p.maxLife;
      const alpha = (1-t) * 0.85;

      // Ice sphere with shine
      const g = this.ctx.createRadialGradient(p.x-p.r*0.3, p.y-p.r*0.3, 0, p.x, p.y, p.r);
      g.addColorStop(0, `rgba(240,255,255,${alpha})`);
      g.addColorStop(0.5, `rgba(168,216,234,${alpha*0.8})`);
      g.addColorStop(1, `rgba(80,140,180,${alpha*0.4})`);

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      this.ctx.fillStyle = g;
      this.ctx.fill();

      // Shine dot
      this.ctx.beginPath();
      this.ctx.arc(p.x-p.r*0.3, p.y-p.r*0.3, p.r*0.25, 0, Math.PI*2);
      this.ctx.fillStyle = `rgba(255,255,255,${alpha*0.9})`;
      this.ctx.fill();
    }
  }

  // ── CLUB: Flood ──────────────────────────────────────────────
  updateFlood() {
    // Water droplets
    if (this.time % 2 === 0) {
      this.particles.push({
        type: 'drop',
        x: Math.random() * this.canvas.width,
        y: -(Math.random()*100),
        vx: (Math.random()-0.5)*1,
        vy: 5 + Math.random()*4,
        r: 2 + Math.random()*5,
        life: 0,
        maxLife: 100,
      });
    }
    // Ripples
    if (this.time % 15 === 0) {
      this.particles.push({
        type: 'ripple',
        x: Math.random()*this.canvas.width,
        y: this.canvas.height * 0.75 + Math.random()*50,
        r: 5,
        life: 0,
        maxLife: 60,
      });
    }

    this.particles = this.particles.filter(p => {
      p.life++;
      if (p.type === 'drop') { p.x += p.vx; p.y += p.vy; }
      if (p.type === 'ripple') { p.r += 3; }
      return p.life < p.maxLife;
    });
  }

  drawFlood() {
    // Water surface waves
    const W = this.canvas.width;
    const H = this.canvas.height;
    const base = H * 0.72;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 4) {
      const y = base
        + Math.sin(x * 0.015 + this.time * 0.05) * 12
        + Math.sin(x * 0.030 + this.time * 0.08) * 6;
      this.ctx.lineTo(x, y);
    }
    this.ctx.lineTo(W, H);
    this.ctx.closePath();

    const wg = this.ctx.createLinearGradient(0, base, 0, H);
    wg.addColorStop(0, 'rgba(30,100,160,0.55)');
    wg.addColorStop(1, 'rgba(10,50,100,0.4)');
    this.ctx.fillStyle = wg;
    this.ctx.fill();
    this.ctx.restore();

    // Rain & drops
    for (const p of this.particles) {
      const t = p.life / p.maxLife;
      const alpha = (1-t) * 0.8;

      if (p.type === 'drop') {
        this.ctx.beginPath();
        this.ctx.ellipse(p.x, p.y, p.r*0.4, p.r, 0, 0, Math.PI*2);
        this.ctx.fillStyle = `rgba(100,180,240,${alpha})`;
        this.ctx.fill();
      } else if (p.type === 'ripple') {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        this.ctx.strokeStyle = `rgba(100,200,255,${(1-t)*0.5})`;
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
      }
    }
  }
}
