import React, { useRef, useEffect } from "react";

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

export default function InteractiveHeartBalloons() {
  const canvasRef = useRef(null);
  const balloons = useRef([]);
  const mouse = useRef({ x: null, y: null });

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

    window.addEventListener("mousemove", (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    });

    class Balloon {
      constructor() {
        this.x = randomRange(0, width);
        this.y = height + randomRange(20, 200);
        this.size = randomRange(20, 40);
        this.speed = randomRange(0.5, 1.5);
        this.sway = randomRange(0.5, 1.5);
        this.swayAngle = Math.random() * Math.PI * 2;
        this.color = `hsl(${randomRange(330, 350)}, 80%, 70%)`;
        this.pop = false;
        this.popAlpha = 1;
      }

      update() {
        if (this.pop) {
          this.popAlpha -= 0.05;
          if (this.popAlpha <= 0) {
            this.reset();
          }
          return;
        }

        this.y -= this.speed;
        this.swayAngle += 0.02;
        this.x += Math.sin(this.swayAngle) * this.sway * 0.5;

        if (this.y + this.size < 0) {
          this.reset();
        }

        // Check mouse proximity for pop effect
        if (
          mouse.current.x &&
          mouse.current.y &&
          !this.pop &&
          Math.hypot(this.x - mouse.current.x, this.y - mouse.current.y) < this.size
        ) {
          this.pop = true;
          // Could add sound or other effects here
        }
      }

      reset() {
        this.x = randomRange(0, width);
        this.y = height + randomRange(20, 200);
        this.size = randomRange(20, 40);
        this.speed = randomRange(0.5, 1.5);
        this.sway = randomRange(0.5, 1.5);
        this.swayAngle = Math.random() * Math.PI * 2;
        this.color = `hsl(${randomRange(330, 350)}, 80%, 70%)`;
        this.pop = false;
        this.popAlpha = 1;
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.pop ? this.popAlpha : 1;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;

        // Draw heart shape
        ctx.beginPath();
        const x = this.x;
        const y = this.y;
        const size = this.size;
        const topCurveHeight = size * 0.3;
        ctx.moveTo(x, y + topCurveHeight);
        ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
        ctx.bezierCurveTo(
          x - size / 2,
          y + (size + topCurveHeight) / 2,
          x,
          y + (size + topCurveHeight) / 1.5,
          x,
          y + size
        );
        ctx.bezierCurveTo(
          x,
          y + (size + topCurveHeight) / 1.5,
          x + size / 2,
          y + (size + topCurveHeight) / 2,
          x + size / 2,
          y + topCurveHeight
        );
        ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
    }

    // Initialize balloons
    const BALLOON_COUNT = 20;
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
      window.removeEventListener("mousemove", () => {});
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
