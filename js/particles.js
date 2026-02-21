// ============================================================
// PARTICLES.JS — Background Idle Particle System
// ============================================================

export class BgParticles {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.raf = null;
    this.isMobile = window.innerWidth < 600;

    // Food ingredient icons for background
    this.icons = ['🍜','🍛','🥢','🌶️','🧅','🥬','🥩','🍲','🫕','🥗','🍝','🍚','🥚','🧄','🌿','🍅'];

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width  = window.innerWidth;
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
    // Spawn
    if (this.particles.length < this.maxParticles && Math.random() < 0.08) {
      this.particles.push(this.spawnParticle());
    }

    this.particles = this.particles.filter(p => {
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;

      const fadeIn  = Math.min(1, p.life / 60);
      const fadeOut = Math.max(0, 1 - (p.life - p.maxLife + 60) / 60);
      p.alpha = p.alphaTarget * fadeIn * fadeOut;

      return p.life < p.maxLife && p.y > -100;
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Background gradient
    const grad = this.ctx.createRadialGradient(
      this.canvas.width/2, this.canvas.height/2, 0,
      this.canvas.width/2, this.canvas.height/2, Math.max(this.canvas.width, this.canvas.height) * 0.7
    );
    grad.addColorStop(0, '#2d0f00');
    grad.addColorStop(0.5, '#1a0800');
    grad.addColorStop(1, '#0d0300');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Stars
    this.drawStars();

    // Particles
    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.font = `${p.size}px serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(p.icon, 0, 0);
      this.ctx.restore();
    }
  }

  drawStars() {
    if (!this._stars) {
      this._stars = [];
      for (let i = 0; i < 80; i++) {
        this._stars.push({
          x: Math.random(), y: Math.random(),
          r: 0.5 + Math.random() * 1.5,
          twinkle: Math.random() * Math.PI * 2,
          speed: 0.02 + Math.random() * 0.03
        });
      }
    }
    for (const s of this._stars) {
      s.twinkle += s.speed;
      const alpha = 0.2 + 0.3 * Math.sin(s.twinkle);
      this.ctx.beginPath();
      this.ctx.arc(s.x * this.canvas.width, s.y * this.canvas.height, s.r, 0, Math.PI * 2);
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
