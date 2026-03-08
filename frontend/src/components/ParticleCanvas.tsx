'use client';
import { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    let W: number, H: number;
    const PARTICLE_COUNT = 70;
    const particles: any[] = [];

    function resize() {
      W = canvas!.width  = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      x = 0; y = 0; vx = 0; vy = 0; r = 0; alpha = 0; color = '';
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.r  = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.7 ? '255,107,53' : '0,229,255';
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0) this.x = W; if (this.x > W) this.x = 0;
        if (this.y < 0) this.y = H; if (this.y > H) this.y = 0;
      }
      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${this.color},${this.alpha})`;
        ctx!.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function drawConnections() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx!.beginPath();
            ctx!.moveTo(particles[a].x, particles[a].y);
            ctx!.lineTo(particles[b].x, particles[b].y);
            ctx!.strokeStyle = `rgba(0,229,255,${(1 - dist / 120) * 0.08})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }
    }

    function animate() {
      ctx!.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} id="bgCanvas" aria-hidden="true" />;
}
