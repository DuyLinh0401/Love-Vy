import React, { useRef, useEffect } from "react";

function MovingCatCanvas() {
  const canvasRef = useRef(null);
  const cat = useRef({
    x: 0,
    y: 70,
    size: 60,
    speed: 1.5,
    step: 0, // để tính bước chân
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = 140;

    function drawCat(x, y, size, step) {
  ctx.save();
  ctx.translate(x, y);

  // Mặt tròn nền
  ctx.fillStyle = "#FFD966"; // vàng nhẹ, ấm áp
  ctx.beginPath();
  ctx.arc(0, 0, size / 2, 0, Math.PI * 2, true);
  ctx.fill();

  // Viền mặt mềm mại
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#E6B800"; // màu nâu vàng
  ctx.beginPath();
  ctx.arc(0, 0, size / 2, 0, Math.PI * 2, true);
  ctx.stroke();

  // Tai trái mềm mại
  ctx.fillStyle = "#FFB347"; // màu cam nhạt
  ctx.beginPath();
  ctx.moveTo(-size / 3, -size / 3);
  ctx.quadraticCurveTo(-size / 2, -size / 2, -size / 4, -size / 6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Tai phải mềm mại
  ctx.beginPath();
  ctx.moveTo(size / 3, -size / 3);
  ctx.quadraticCurveTo(size / 2, -size / 2, size / 4, -size / 6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Mắt trái
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(-size / 6, -size / 10, size / 12, size / 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Highlight mắt trái
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.beginPath();
  ctx.ellipse(-size / 6 - size / 30, -size / 14, size / 30, size / 30, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mắt phải
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(size / 6, -size / 10, size / 12, size / 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Highlight mắt phải
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.beginPath();
  ctx.ellipse(size / 6 - size / 30, -size / 14, size / 30, size / 30, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mũi nhỏ xinh
  ctx.fillStyle = "#FF6F91";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-size / 40, size / 15);
  ctx.lineTo(size / 40, size / 15);
  ctx.closePath();
  ctx.fill();

  // Miệng cười nhẹ nhàng
  ctx.strokeStyle = "#FF6F91";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, size / 15);
  ctx.lineTo(0, size / 10);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(-size / 20, size / 10, size / 20, 0, Math.PI / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(size / 20, size / 10, size / 20, Math.PI / 2, Math.PI);
  ctx.stroke();

  // Chân trước (vung chân theo step như trước)
  const legLength = size / 3;
  const legOffsetX = size / 6;
  const legBaseY = size / 2;

  let legLeftY = legBaseY + Math.sin(step) * (legLength / 3);
  ctx.strokeStyle = "#8B4513";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-legOffsetX, 0);
  ctx.lineTo(-legOffsetX, legLeftY);
  ctx.stroke();

  let legRightY = legBaseY + Math.sin(step + Math.PI) * (legLength / 3);
  ctx.beginPath();
  ctx.moveTo(legOffsetX, 0);
  ctx.lineTo(legOffsetX, legRightY);
  ctx.stroke();

  ctx.restore();
}


    let animationFrameId;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const c = cat.current;

      // Nhấp nhô nhẹ (body lên xuống)
      const bobbing = Math.sin(c.step) * 3;

      drawCat(c.x, c.y + bobbing, c.size, c.step);

      c.x += c.speed;
      c.step += 0.15; // tốc độ bước chân

      if (c.x - c.size / 2 > canvas.width) {
        c.x = -c.size;
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    function handleResize() {
      canvas.width = window.innerWidth;
      canvas.height = 140;
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
        bottom: 20,
        left: 0,
        width: "100vw",
        height: 140,
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 1000,
      }}
    />
  );
}

export default MovingCatCanvas;
