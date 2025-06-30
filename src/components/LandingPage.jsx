import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import HeartFireworks from "./HeartFireworks";
import HeartBalloons from "./HeartBalloons";
import InteractiveHeartBalloons from "./InteractiveHeartBalloons";
import StarryNightHearts from "./StarryNightHearts"; // import mới

const quotes = [
  "I looked at your face… my heart jumped all over the place.",
  "I love you with all I have!",
  "Take my hand and let me take care of you in the next days of this life. I love you!",
  " Frendship often ends in love, but love in frendship-never.",
];
 
const randomQuote = () => {
  const day = new Date().getDate();
  return quotes[day % quotes.length];
};

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minHeight: "100vh",
        // background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Poppins', sans-serif",
        color: "#FDEFF4",
      }}
    >
      {/* Nền trời đêm sao + tim lơ lửng */}
      <StarryNightHearts />

      {/* Hiệu ứng canvas dưới cùng */}
      <HeartFireworks />
      <HeartBalloons />
      <InteractiveHeartBalloons />

      {/* Nội dung chính */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          textAlign: "center",
        }}
      >
        <motion.h1
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: "5rem",
            marginBottom: 10,
            fontWeight: "400",
            color: "#FF9ACD",
            textShadow:
              "2px 2px 10px rgba(255, 154, 205, 0.8), 0 0 20px rgba(255, 154, 205, 0.6)",
          }}
        >
          LoveNest
        </motion.h1>

        <p
          style={{
            fontFamily: "'Sacramento', cursive",
            fontSize: "2rem",
            marginBottom: 40,
            fontWeight: "400",
            color: "rgb(125 63 78)",
            textShadow: "1px 1px 5px rgba(255, 209, 220, 0.7)",
            maxWidth: "80vw",
          }}
        >
          {randomQuote()}
        </p>

        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0 0 20px #FF69B4" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
          style={{
            padding: "18px 50px",
            borderRadius: 50,
            border: "none",
            background:
              "linear-gradient(45deg, #FF69B4, #FF1493, #FF69B4)",
            color: "white",
            fontSize: "1.4rem",
            cursor: "pointer",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: "700",
            boxShadow: "0 8px 20px rgba(255, 20, 147, 0.8)",
            transition: "box-shadow 0.3s ease",
            userSelect: "none",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Start
        </motion.button>
      </motion.div>
    </div>
  );
}
