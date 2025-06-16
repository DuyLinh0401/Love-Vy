import React, { useRef, useEffect } from "react";

function PetalCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const petalsCount = 60;
    const petals = [];

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    class Petal {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = random(0, width);
        this.y = random(-height, 0);
        this.size = random(10, 20);
        this.speedY = random(1, 2);
        this.speedX = random(-0.5, 0.5);
        this.angle = random(0, Math.PI * 2);
        this.spin = random(0.01, 0.03);
        this.opacity = random(0.4, 0.8);
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.spin;

        if (this.y > height || this.x < -this.size || this.x > width + this.size) {
          this.reset();
          this.y = -this.size;
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = `rgba(255, 182, 193, ${this.opacity})`; // màu hồng pastel nhẹ
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.6, this.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < petalsCount; i++) {
      petals.push(new Petal());
    }

    let animationFrameId;

    function animate() {
      ctx.clearRect(0, 0, width, height);
      petals.forEach((petal) => {
        petal.update();
        petal.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    function handleResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        userSelect: "none",
      }}
    />
  );
}

export default PetalCanvas;
