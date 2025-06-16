import React, { useRef, useEffect } from "react";

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function createHeartPath(ctx, x, y, size) {
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  // trái tim vẽ bằng Bezier curves
  ctx.bezierCurveTo(
    x, y,
    x - size / 2, y,
    x - size / 2, y + topCurveHeight
  );
  ctx.bezierCurveTo(
    x - size / 2, y + (size + topCurveHeight) / 2,
    x, y + (size + topCurveHeight) / 1.5,
    x, y + size
  );
  ctx.bezierCurveTo(
    x, y + (size + topCurveHeight) / 1.5,
    x + size / 2, y + (size + topCurveHeight) / 2,
    x + size / 2, y + topCurveHeight
  );
  ctx.bezierCurveTo(
    x + size / 2, y,
    x, y,
    x, y + topCurveHeight
  );
  ctx.closePath();
}

export default function HeartFireworks() {
  const canvasRef = useRef(null);
  const fireworks = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let width, height;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = randomRange(8, 15);
        this.color = color;
        this.speedX = randomRange(-3, 3);
        this.speedY = randomRange(-5, -1);
        this.gravity = 0.05;
        this.alpha = 1;
        this.fadeRate = 0.015;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += this.gravity;
        this.alpha -= this.fadeRate;
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        createHeartPath(ctx, this.x, this.y, this.size);
        ctx.fill();
        ctx.restore();
      }

      isAlive() {
        return this.alpha > 0;
      }
    }

    const colors = ["#FF4D6D", "#FF6584", "#FF7F9A", "#FF9BB2"];

    function createFirework() {
      const x = randomRange(width * 0.2, width * 0.8);
      const y = height;
      const count = 30;
      const color = colors[Math.floor(Math.random() * colors.length)];
      let particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, color));
      }
      fireworks.current.push(particles);
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      if (fireworks.current.length < 5 && Math.random() < 0.05) {
        createFirework();
      }

      fireworks.current.forEach((particles, i) => {
        particles.forEach((p) => {
          p.update();
          p.draw(ctx);
        });

        fireworks.current[i] = particles.filter((p) => p.isAlive());
        if (fireworks.current[i].length === 0) {
          fireworks.current.splice(i, 1);
        }
      });

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
        zIndex: 0,
      }}
    />
  );
}
