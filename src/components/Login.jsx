// LoveDialPadWithEffects.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function LoveDialPadWithEffects() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [bubbles, setBubbles] = useState([]);
  const audioRef = useRef(null);
  const correctCode = "17052025";
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (code === correctCode) {
      timer = setTimeout(() => navigate("/entry"), 3000);
    }
    return () => clearTimeout(timer);
  }, [code, navigate]);

  useEffect(() => {
  let timer;
  if (code === correctCode) {
    setIsLoading(true); // Hiện hiệu ứng loading
    timer = setTimeout(() => {
      setIsLoading(false);
      navigate("/love");
    }, 3000); // 3s chờ "hiệu ứng tình yêu"
  }
  return () => clearTimeout(timer);
}, [code, navigate]);


  const handleKeyPress = (value) => {
  if (audioRef.current) {
    audioRef.current.currentTime = 0;
    audioRef.current
      .play()
      .then(() => {
        // âm thanh đã phát thành công
      })
      .catch((err) => {
        console.warn("Không thể phát âm thanh:", err);
      });
  }

  if (code.length < 8) {
    const newCode = code + value;
    setCode(newCode);
    if (newCode.length === 8) {
      if (newCode === correctCode) {
        setMessage("Anh yêu em ❤️");
        setMessageColor("#ff4a6e");
        launchFireworks();
      } else {
        setMessage("Em không yêu anh rồi!");
        setMessageColor("#d32f2f");
        createBubbles();
      }
    } else {
      setMessage("");
    }
  }
};


  const launchFireworks = () => {
  const duration = 1 * 1000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 120,
      origin: { x: 0, y: 0.4 },
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 120,
      origin: { x: 1, y: 0.4 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};


  const createBubbles = () => {
    const id = Date.now();
    setBubbles((prev) => [
      ...prev,
      { id, text: "💬 Không đúng rồi!", top: 100 + Math.random() * 50 },
    ]);
    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== id));
    }, 3000);
  };

  const handleClear = () => {
    setCode("");
    setMessage("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: "linear-gradient(135deg, #ffdce0, #ffe3ec, #fff0f3)",
        fontFamily: "'Dancing Script', cursive",
        color: "#6b2233",
        position: "static",  // hoặc xoá hẳn dòng này
        overflow: "visible", // để pháo hoa không bị cắt
      }}
    >
      <audio ref={audioRef} src="/cute_click.mp3" preload="auto" />

      <motion.h1 style={{ fontSize: "3.5rem", marginBottom: 20 }}>LoveNest</motion.h1>
      <motion.h2 style={{ fontSize: "2rem", marginBottom: 20 }}>
        Em có nhớ ngày đầu tiên chúng ta gặp nhau ? 💘
      </motion.h2>


      <div
        style={{
          backgroundColor: "white",
          padding: 30,
          borderRadius: 30,
          boxShadow: "0 10px 25px rgba(255, 111, 130, 0.35)",
          textAlign: "center",
          width: 340,
        }}
      >
        <div
          style={{
            fontSize: "2rem",
            textAlign: "center",
            padding: "10px 20px",
            borderRadius: 16,
            border: "2px solid #ff6f91",
            marginBottom: 20,
            backgroundColor: "#fff9f9",
            letterSpacing: "6px",
            color: "#d73c56",
            minHeight: 60,
          }}
        >
          {code}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 20,
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
            <motion.button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "20px",
                fontSize: "1.8rem",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#ff6f91",
                color: "white",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(255,111,145,0.4)",
                position: "relative",
              }}
            >
              {num}
              <motion.span
                animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  fontSize: "1rem",
                  color: "#ffeef1",
                }}
              >
                💖
              </motion.span>
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleClear}
          style={{
            padding: "10px 20px",
            borderRadius: 25,
            border: "none",
            backgroundColor: "#ffe6ea",
            color: "#ff3b61",
            fontWeight: "600",
            fontFamily: "'Dancing Script', cursive",
            fontSize: "1.1rem",
            cursor: "pointer",
          }}
        >
          Xoá hết
        </motion.button>

        {message && (
          <div
            style={{
              marginTop: 20,
              fontSize: "1.3rem",
              fontWeight: "bold",
              color: messageColor,
              fontFamily: "'Dancing Script', cursive",
            }}
          >
            {message}
          </div>
        )}
      </div>

      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -150 }}
          exit={{ opacity: 0 }}
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: b.top,
            backgroundColor: "#fff0f3",
            padding: "10px 20px",
            borderRadius: 20,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            color: "#ff3b61",
            fontSize: "1rem",
            fontFamily: "'Dancing Script', cursive",
          }}
        >
          {b.text}
        </motion.div>
      ))}
      {isLoading && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      height: "100vh",
      width: "100vw",
      backgroundColor: "rgba(255,240,245,0.9)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      flexDirection: "column",
      fontFamily: "'Dancing Script', cursive",
    }}
  >
    <motion.div
      animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 1.2, repeat: Infinity }}
      style={{
        fontSize: "5rem",
        color: "#ff4a6e",
      }}
    >
      ❤️
    </motion.div>
    <div style={{ fontSize: "1.5rem", marginTop: 20, color: "#d73c56" }}>
      Đang mở cánh cửa trái tim...
    </div>
  </div>
)}

    </div>
  );
}
