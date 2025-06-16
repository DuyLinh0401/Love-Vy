// src/pages/LoveAnniversary.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LOVE_START_DATE = new Date("2025-05-17T00:00:00");

function getDaysTogether() {
  const now = new Date();
  const diff = now - LOVE_START_DATE;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}



export default function LoveAnniversary() {
  const [days, setDays] = useState(getDaysTogether());
  const [zoomImage, setZoomImage] = useState(null);

useEffect(() => {
  const handleMouseMove = (e) => {
    const heart = document.createElement("div");
    heart.innerText = "❤️";
    Object.assign(heart.style, {
      position: "fixed",
      left: `${e.clientX}px`,
      top: `${e.clientY}px`,
      pointerEvents: "none",
      transform: "translate(-50%, -50%)",
      animation: "floatHeart 1s ease-out forwards",
      fontSize: "16px",
      zIndex: 9999,
    });
    document.body.appendChild(heart);

    // Remove after animation
    setTimeout(() => heart.remove(), 1000);
  };

  window.addEventListener("mousemove", handleMouseMove);
  return () => window.removeEventListener("mousemove", handleMouseMove);
}, []);



  useEffect(() => {
    const interval = setInterval(() => setDays(getDaysTogether()), 1000);
    return () => clearInterval(interval);
  }, []);
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());
useEffect(() => {
  const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
  return () => clearInterval(timeInterval);
}, []);
  return (
    
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #ffe0ec, #fad0c4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        color: "#b03a5b",
        fontFamily: "'Dancing Script', cursive",
        textAlign: "center",
        padding: 20,
        position: "relative",
      }}
    >
      <h1 style={{ fontSize: 50, marginBottom: 20, color: "#b30059" }}>
        ❤️ Chúng ta đã bên nhau
      </h1>
      <h2
        style={{
          fontSize: 80,
          margin: 0,
          background: "linear-gradient(90deg, #ff758c, #ff7eb3)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "2px 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        {days} ngày
      </h2>
      <p style={{ fontSize: 24, marginTop: 20, color: "#4b002f" }}>
        Bắt đầu từ ngày 17 tháng 5 năm 2025 💌
      </p>
<p style={{ fontSize: 20, color: "#800040", marginTop: 10 }}>
  ⏰ Bây giờ là: {currentTime.toLocaleString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  })}
</p>
<button
  onClick={() => navigate("/entry")}
  style={{
    marginTop: 50,
    padding: "12px 24px",
    fontSize: 20,
    borderRadius: 30,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(to right, #ff9a9e, #fad0c4)",
    color: "#fff",
    fontFamily: "'Dancing Script', cursive",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    transition: "transform 0.2s ease",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
>
  💖 Kỉ niệm chúng mình hẹ hẹ
</button>


      <div style={{ marginTop: 40, display: 'flex', gap: 40 }}>
        {[{ src: require("./assets/dl.jpg"), alt: "Person 1" }, { src: require("./assets/vy.jpg"), alt: "Person 2" }].map((img, index) => (
          <div
            key={index}
            onClick={() => setZoomImage(img.src)}
            style={{
              cursor: "pointer",
            transition: "transform 0.3s ease, box-shadow 0.3s",
            transform: "scale(1)",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <div
              style={{
                padding: 5,
                borderRadius: 20,
                background: "linear-gradient(135deg, #ff9a9e, #fad0c4, #fbc2eb)",
                display: "inline-block",
                boxShadow: "0 6px 16px rgba(255, 105, 180, 0.4)",
                transition: "box-shadow 0.3s ease",
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                style={{
                  width: 160,
                height: 160,
                objectFit: "cover",
                borderRadius: 15,
                display: "block",
                border: "3px solid white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal phóng to ảnh */}
      {zoomImage && (
        <div
          onClick={() => setZoomImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <img
            src={zoomImage}
            alt="Zoom"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 20,
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              transition: "transform 0.3s ease",
            }}
          />
        </div>
      )}

      <style>
  {`
    @keyframes floatHeart {
      0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -150%) scale(1.8);
      }
    }
  `}
</style>

    </div>
  );
}
