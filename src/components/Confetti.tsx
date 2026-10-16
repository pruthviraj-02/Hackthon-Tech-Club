import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  durationMs?: number;
  onFinish?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

const COLORS = ['#FFE066', '#FF6B6B', '#4ECDC4', '#111111', '#FFFFFF'];

export const Confetti: React.FC<ConfettiProps> = ({ durationMs = 3500, onFinish }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize 100 particles bursting from center-bottom / mid-screen
    const particles: Particle[] = [];
    for (let i = 0; i < 110; i++) {
      const angle = (Math.random() * Math.PI) / 1.1 + Math.PI * 0.05; // upward spray
      const speed = Math.random() * 14 + 6;
      particles.push({
        x: width * 0.5 + (Math.random() * 100 - 50),
        y: height * 0.45 + (Math.random() * 50 - 25),
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: -Math.abs(Math.sin(angle) * speed),
        size: Math.random() * 8 + 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
      });
    }

    let animationFrameId: number;
    const startTime = Date.now();

    const render = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > durationMs) {
        if (onFinish) onFinish();
        return;
      }

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.38; // gravity
        p.vx *= 0.985; // drag
        p.rotation += p.rotationSpeed;

        if (elapsed > durationMs - 800) {
          p.opacity = Math.max(0, p.opacity - 0.02);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 1.5;

        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.8);
        ctx.strokeRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.8);

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [durationMs, onFinish]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 w-full h-full"
    />
  );
};
