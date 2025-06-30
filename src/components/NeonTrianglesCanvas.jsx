import React, { useRef, useEffect } from "react";

const colors = ["#FF2D95", "#8E44AD", "#2980FF"];

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function NeonTrianglesCanvas() {
  const canvasRef = useRef(null);
  const triangles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // Khởi tạo mảng tam giác
    const TRIANGLE_COUNT = 30;
    triangles.current = [];

    for (let i = 0; i < TRIANGLE_COUNT; i++) {
      triangles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: randomRange(20, 50),
        angle: Math.random() * Math.PI * 2,
        speed: randomRange(0.2, 0.8),
        rotationSpeed: randomRange(0.002, 0.008),
        colorIndex: Math.floor(Math.random() * colors.length),
        glowAlpha: Math.random() * 0.6 + 0.4,
        glowDir: 1,
      });
    }

    const drawTriangle = (ctx, x, y, size, angle, color, glowAlpha) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, -size / Math.sqrt(3));
      ctx.lineTo(-size / 2, size / (2 * Math.sqrt(3)));
      ctx.lineTo(size / 2, size / (2 * Math.sqrt(3)));
      ctx.closePath();

      // Glow effect
      ctx.shadowColor = color;
      ctx.shadowBlur = 15 * glowAlpha;

      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      triangles.current.forEach((tri) => {
        // Move down slowly
        tri.y += tri.speed;
        if (tri.y - tri.size > canvas.height) tri.y = -tri.size;

        // Rotate
        tri.angle += tri.rotationSpeed;

        // Glow pulsate
        tri.glowAlpha += tri.glowDir * 0.01;
        if (tri.glowAlpha > 1) tri.glowDir = -1;
        else if (tri.glowAlpha < 0.4) tri.glowDir = 1;

        drawTriangle(ctx, tri.x, tri.y, tri.size, tri.angle, colors[tri.colorIndex], tri.glowAlpha);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
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

export default NeonTrianglesCanvas;
