import React, { useRef, useEffect } from "react";

function ConnectedHeartTrailsCanvas() {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Các hạt tim
    const maxHearts = 50;
    const hearts = [];

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    // Tạo hình trái tim đơn giản dạng path
    function drawHeart(ctx, x, y, size, alpha = 1) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size / 20, size / 20);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#FF5D8F";
      ctx.shadowColor = `rgba(255,93,143,${alpha})`;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(0, -3, -5, -3, -5, 0);
      ctx.bezierCurveTo(-5, 5, 0, 8, 0, 12);
      ctx.bezierCurveTo(0, 8, 5, 5, 5, 0);
      ctx.bezierCurveTo(5, -3, 0, -3, 0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Heart particle class
    class Heart {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = random(0, width);
        this.y = random(0, height);
        this.size = random(8, 20);
        this.speedX = random(-0.5, 0.5);
        this.speedY = random(-0.5, 0.5);
        this.alpha = random(0.4, 0.8);
        this.alphaDirection = 1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bật tắt alpha để nhấp nháy nhẹ
        this.alpha += 0.005 * this.alphaDirection;
        if (this.alpha >= 0.8) this.alphaDirection = -1;
        if (this.alpha <= 0.4) this.alphaDirection = 1;

        // Đổi chiều khi chạm biên
        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
      }
      draw() {
        drawHeart(ctx, this.x, this.y, this.size, this.alpha);
      }
    }

    for (let i = 0; i < maxHearts; i++) {
      hearts.push(new Heart());
    }

    // Khoảng cách để nối tim
    const maxDist = 120;
    const mouseRadius = 150;

    function connectHearts() {
      for (let i = 0; i < hearts.length; i++) {
        for (let j = i + 1; j < hearts.length; j++) {
          const dx = hearts[i].x - hearts[j].x;
          const dy = hearts[i].y - hearts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            // Tính alpha dựa vào khoảng cách
            const lineAlpha = 1 - dist / maxDist;

            // Tăng alpha nếu gần chuột
            let enhancedAlpha = lineAlpha;
            if (mousePos.current.x !== null) {
              const mdx = (hearts[i].x + hearts[j].x) / 2 - mousePos.current.x;
              const mdy = (hearts[i].y + hearts[j].y) / 2 - mousePos.current.y;
              const mouseDist = Math.sqrt(mdx * mdx + mdy * mdy);
              if (mouseDist < mouseRadius) {
                enhancedAlpha = Math.min(1, lineAlpha + (mouseRadius - mouseDist) / mouseRadius);
              }
            }

            ctx.strokeStyle = `rgba(255,93,143,${enhancedAlpha * 0.6})`;
            ctx.lineWidth = 1;
            ctx.shadowColor = `rgba(255,93,143,${enhancedAlpha * 0.8})`;
            ctx.shadowBlur = 6;

            ctx.beginPath();
            ctx.moveTo(hearts[i].x, hearts[i].y);
            ctx.lineTo(hearts[j].x, hearts[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      // Tạo trail mờ dần (chứ không xóa sạch)
      ctx.fillStyle = "rgba(255, 240, 245, 0.15)";
      ctx.fillRect(0, 0, width, height);

      // Update và vẽ tim
      hearts.forEach((heart) => {
        heart.update();
        heart.draw();
      });

      // Vẽ đường nối
      connectHearts();

      requestAnimationFrame(animate);
    }

    animate();

    function handleResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", handleResize);

    // Cập nhật vị trí chuột
    function handleMouseMove(e) {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    }
    function handleMouseLeave() {
      mousePos.current.x = null;
      mousePos.current.y = null;
    }
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
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
        userSelect: "none",
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        background: "transparent",
        
      }}
    />
  );
}

export default ConnectedHeartTrailsCanvas;
