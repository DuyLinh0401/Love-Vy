import React, { useRef, useEffect } from "react";

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

export default function HeartBalloons() {
  const canvasRef = useRef(null);
  const balloons = useRef([]);

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

    class Balloon {
      constructor() {
        this.x = randomRange(0, width);
        this.y = height + randomRange(20, 200);
        this.size = randomRange(20, 40);
        this.speed = randomRange(0.5, 1.5);
        this.sway = randomRange(0.5, 1.5);
        this.swayAngle = Math.random() * Math.PI * 2;
        this.color = `hsl(${randomRange(330, 350)}, 80%, 70%)`; // hồng đỏ nhạt
      }

      update() {
        this.y -= this.speed;
        this.swayAngle += 0.02;
        this.x += Math.sin(this.swayAngle) * this.sway * 0.5;
        if (this.y + this.size < 0) {
          this.y = height + randomRange(20, 200);
          this.x = randomRange(0, width);
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        // vẽ trái tim
        ctx.beginPath();
        const x = this.x;
        const y = this.y;
        const size = this.size;
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
        ctx.fill();

        // dây bóng
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, y + size);
        ctx.lineTo(x, y + size + 30);
        ctx.stroke();

        ctx.restore();
      }
    }

    // Tạo bóng ban đầu
    const BALLOON_COUNT = 15;
    balloons.current = [];
    for (let i = 0; i < BALLOON_COUNT; i++) {
      balloons.current.push(new Balloon());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      balloons.current.forEach((balloon) => {
        balloon.update();
        balloon.draw(ctx);
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
        pointerEvents: "none",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
      }}
    />
  );
}
