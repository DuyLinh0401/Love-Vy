import React, { useRef, useEffect } from "react";

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function createHeartPath(ctx, x, y, size) {
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
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

export default function StarryNightHearts() {
  const canvasRef = useRef(null);
  const stars = useRef([]);
  const hearts = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    class Star {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random();
        this.alphaChange = 0.005 + Math.random() * 0.015;
      }

      update() {
        this.alpha += this.alphaChange;
        if (this.alpha <= 0) {
          this.alpha = 0;
          this.alphaChange = -this.alphaChange;
        }
        if (this.alpha >= 1) {
          this.alpha = 1;
          this.alphaChange = -this.alphaChange;
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.shadowColor = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.restore();
      }
    }

    class Heart {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = randomRange(10, 20);
        this.speedY = randomRange(0.2, 0.5);
        this.alpha = randomRange(0.3, 0.7);
        this.alphaChange = 0.002;
        this.swayAngle = Math.random() * Math.PI * 2;
        this.swayAmplitude = randomRange(10, 20);
      }

      update() {
        this.y -= this.speedY;
        this.swayAngle += 0.02;
        this.x += Math.sin(this.swayAngle) * 0.3;

        if (this.y + this.size < 0) {
          this.y = height + this.size;
          this.x = Math.random() * width;
        }

        this.alpha += this.alphaChange;
        if (this.alpha >= 0.9 || this.alpha <= 0.3) {
          this.alphaChange = -this.alphaChange;
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = "#FF69B4";
        ctx.shadowColor = "#FF69B4";
        ctx.shadowBlur = 10;
        createHeartPath(ctx, this.x, this.y, this.size);
        ctx.fill();
        ctx.restore();
      }
    }

    // Khởi tạo stars & hearts
    const STAR_COUNT = 150;
    const HEART_COUNT = 30;
    stars.current = [];
    hearts.current = [];

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.current.push(new Star());
    }
    for (let i = 0; i < HEART_COUNT; i++) {
      hearts.current.push(new Heart());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      stars.current.forEach((star) => {
        star.update();
        star.draw(ctx);
      });

      hearts.current.forEach((heart) => {
        heart.update();
        heart.draw(ctx);
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
