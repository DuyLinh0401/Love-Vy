// src/pages/MemoryDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import InteractiveParticles from "../components/InteractiveParticles";
import bgImage from "./assets/7f9c8640-c962-4048-be69-949e4694cb94.png";

//icon

import deco1 from "./assets/0a369e1da211a03c13baaebffbaf20bd-removebg-preview.png";
import deco2 from "./assets/0b0b637d194471f9d8eaef06cdee602c-removebg-preview.png";
import deco3 from "./assets/2af386e3875d3f9aa16a7c4bf1910f85-removebg-preview.png";
import deco4 from "./assets/4a10507bf058a0df0a8fbd70e9107364-removebg-preview.png";
import deco5 from "./assets/6fbc37bf2cb543716599233d5c9153b3-removebg-preview.png";
import deco6 from "./assets/c383e3dc4f60aefac420def027c285d2-removebg-preview.png";
import deco7 from "./assets/f28c31c8873bfc1181c6a65bc28d7d14-removebg-preview.png";
import deco8 from "./assets/icon1-removebg-preview.png";
import deco9 from "./assets/icon2-removebg-preview.png";
import deco10 from "./assets/deco13.png";
import deco11 from "./assets/deco12.png";
import deco12 from "./assets/deco14.png";
import deco13 from "./assets/deco15.png";
import deco14 from "./assets/deco1.png";
import deco15 from "./assets/deco17.png";
const API_URL = "https://669524ab4bd61d8314ca3810.mockapi.io/api/v1/lathu";

export default function MemoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEntry(data);
        setLoading(false);
      })
      .catch(() => navigate("/"));
  }, [id, navigate]);

  if (loading || !entry) return <p style={{ padding: 40 }}>Đang tải kỷ niệm...</p>;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // ✅ giúp ảnh nền cố định khi cuộn
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        fontFamily: "'Quicksand', sans-serif",
        position: "relative",
        zIndex: 0,
         overflowX: "hidden",
      }}
    >
     
      <div
        style={{
          backgroundColor: "white",
          maxWidth: 960,
          width: "100%",
          borderRadius: 20,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          padding: 24,
          display: "flex",
          flexDirection: "row",
          gap: 24,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {entry.image && (
  <img
    src={entry.image}
    alt="memory"
    style={{
      width: 300,
      height: 220,
      objectFit: "cover",
      borderRadius: 16,
      flexShrink: 0,
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      cursor: "pointer",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = "scale(1.05)";
      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
    }}
    onClick={() => {
      const overlay = document.createElement("div");
      Object.assign(overlay.style, {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      });
      overlay.onclick = () => document.body.removeChild(overlay);

      const zoomedImg = document.createElement("img");
      zoomedImg.src = entry.image;
      zoomedImg.style.maxWidth = "90%";
      zoomedImg.style.maxHeight = "90%";
      zoomedImg.style.borderRadius = "12px";
      zoomedImg.style.boxShadow = "0 0 20px rgba(255,255,255,0.5)";
      overlay.appendChild(zoomedImg);

      document.body.appendChild(overlay);
    }}
  />
)}

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
            
          <h2 style={{ fontSize: 28, color: "#7D4B94", marginBottom: 12,
            fontFamily: "'Dancing Script', cursive",
            textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
            background: "linear-gradient(to right, #ff9aa2, #fad0c4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent" }}>
            Kỷ niệm ngày {entry.date}
          </h2>
          <p style={{ fontSize: 20, whiteSpace: "pre-line", lineHeight: 1.8,
            fontFamily: "'Quicksand', sans-serif",
            textShadow: "0.5px 0.5px 1px rgba(0,0,0,0.1)" }}>
            {entry.text}
          </p>
          <button
            onClick={() => navigate(-1)}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              backgroundColor: "#FF9AA2",
              color: "white",
              border: "none",
              borderRadius: 10,
              fontWeight: "bold",
              cursor: "pointer",
              alignSelf: "flex-start",
            }}
          >
            ← Quay lại
          </button>
        </div>
      </div>
      <img src={deco1} alt="deco1" style={{ position: "absolute", top: 40, left: 40, width: 90, opacity: 0.9 }} />
  <img src={deco2} alt="deco2" style={{ position: "absolute", top: 100, right: 30, width: 70, opacity: 0.85 }} />
  <img src={deco3} alt="deco3" style={{ position: "absolute", bottom: 50, left: 60, width: 100, opacity: 0.9 }} />
  <img src={deco4} alt="deco4" style={{ position: "absolute", bottom: 30, right: 80, width: 80, opacity: 0.9 }} />
  <img src={deco5} alt="deco5" style={{ position: "absolute", top: 200, left: "50%", transform: "translateX(-50%)", width: 70, opacity: 0.85 }} />
  <img src={deco6} alt="deco6" style={{ position: "absolute", top: "50%", left: 20, transform: "translateY(-50%)", width: 60, opacity: 0.8 }} />
  <img src={deco7} alt="deco7" style={{ position: "absolute", bottom: "45%", right: 25, transform: "translateY(50%)", width: 50, opacity: 0.8 }} />
  <img src={deco8} alt="deco8" style={{ position: "absolute", top: 10, left: "25%", width: 100, opacity: 0.8 }} />
  <img src={deco9} alt="deco9" style={{ position: "absolute", top: 10, right: "20%", width: 80, opacity: 0.85 }} />
  <img src={deco10} alt="deco10" style={{ position: "absolute", bottom: 10, left: "30%", width: 60, opacity: 0.85 }} />
  <img src={deco11} alt="deco11" style={{ position: "absolute", bottom: 10, right: "25%", width: 50, opacity: 0.8 }} />          
  <img src={deco12} alt="deco12" style={{ position: "absolute", top: 150, left: "20%", width: 70, opacity: 0.85 }} />
  <img src={deco13} alt="deco13" style={{ position: "absolute", top: 160, right: "18%", width: 114, opacity: 0.85 }} />
  <img src={deco14} alt="deco14" style={{ position: "absolute", top: 180, left: "35%", width: 114, opacity: 0.8 }} />
  <img src={deco15} alt="deco15" style={{ position: "absolute", top: 170, right: "30%", width: 40, opacity: 0.8 }} />
    </div>
  );
}
