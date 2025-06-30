import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import loveIcon from "./assets/z6619465197701_d1bb106b337f232289327ee834b6890e.jpg";
const API_BASE = "https://682df035746f8ca4a47b44f1.mockapi.io/quaiuem/tamsu"; // MockAPI endpoint

const PASSWORD = "02122007"; // Khóa bảo mật chung

export default function LoveLetter() {
  const [letters, setLetters] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [awaitingPasswordId, setAwaitingPasswordId] = useState(null); // id thư chờ pass
  const [newLetterMessage, setNewLetterMessage] = useState(""); // Message cho thư mới
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa thư mới

  const navigate = useNavigate();

  // Tải danh sách thư từ MockAPI
  useEffect(() => {
    fetch(API_BASE)
      .then((res) => res.json())
      .then((data) => setLetters(data))
      .catch(console.error);
  }, []);

  // Tạo thư mới
  const addLetter = () => {
    setIsEditing(true); // Chuyển trạng thái sang chỉnh sửa
    setNewLetterMessage(""); // Đặt nội dung thư mới trống
  };

  // Lưu thư mới vào MockAPI
  const saveNewLetter = async () => {
    if (!newLetterMessage.trim()) {
      alert("Vui lòng nhập nội dung thư.");
      return;
    }

    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newLetterMessage }),
      });

      const newLetter = await response.json();
      setLetters((prev) => [...prev, newLetter]);
      setNewLetterMessage(""); // Reset input sau khi lưu
      setIsEditing(false); // Tắt trạng thái chỉnh sửa
    } catch (error) {
      alert("Lỗi khi lưu thư.");
      console.error(error);
    }
  };

  // Khi click thư nhỏ, yêu cầu nhập mật khẩu
  const requestOpenLetter = (id) => {
    setPasswordInput("");
    setPasswordError("");
    setAwaitingPasswordId(id);
  };

  const handleDeleteLetter = async (id) => {
  const confirm = window.confirm("Bạn có chắc muốn xóa thư này?");
  if (!confirm) return;

  try {
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    setLetters((prev) => prev.filter((l) => l.id !== id));
  } catch (err) {
    alert("Xóa không thành công!");
    console.error(err);
  }
};
  const [hoveredId, setHoveredId] = useState(null);


  // Xác thực mật khẩu
  const verifyPassword = () => {
    if (passwordInput === PASSWORD) {
      setOpenId(awaitingPasswordId);
      setAwaitingPasswordId(null);
      setPasswordInput("");
      setPasswordError("");
    } else {
      setPasswordError("Mật khẩu không đúng, vui lòng thử lại!");
    }
  };

  // Đóng thư
  const closeLetter = () => {
    setOpenId(null);
  };

  const openLetterData = letters.find((l) => l.id === openId);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #FFD1DC, #FFE4E1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        
        fontFamily: "'Dancing Script', cursive",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Trái tim rơi */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            top: -30,
            left: `${Math.random() * 100}%`,
            fontSize: "1.5rem",
            color: "#FF6B81",
            pointerEvents: "none",
            userSelect: "none",
          }}
          animate={{ y: "100vh", opacity: [1, 0.5, 0] }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          ❤️
        </motion.div>
      ))}

      <h1
        style={{
          color: "#FF6B81",
          marginBottom: 20,
          fontFamily: "'Dancing Script', cursive",
          fontWeight: "700",
          fontSize: "3rem",
          textShadow: "0 2px 6px rgba(255,107,129,0.5)",
        }}
      >
        Đôi lời gửi đến em yêu
      </h1>

      <div style={{ display: "flex", gap: 15, marginBottom: 30 }}>
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0 5px 10px rgba(255,107,129,0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={addLetter}
          style={{
            padding: "10px 20px",
            borderRadius: 20,
            border: "none",
            backgroundColor: "#FF6B81",
            color: "white",
            fontFamily: "'Quicksand', sans-serif",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 5px 15px rgba(255,107,129,0.4)",
            transition: "all 0.3s ease",
          }}
        >
          Viết bức thư mới
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0 5px 10px rgba(93,58,135,0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/diary")}
          style={{
            padding: "10px 20px",
            borderRadius: 20,
            border: "none",
            backgroundColor: "#5D3A87",
            color: "white",
            fontFamily: "'Quicksand', sans-serif",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          Đi đến nhật ký type 1
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0 5px 10px rgba(93,58,135,0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/memory")}
          style={{
            padding: "10px 20px",
            borderRadius: 20,
            border: "none",
            backgroundColor: "#5D3A87",
            color: "white",
            fontFamily: "'Quicksand', sans-serif",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          Đi đến nhật ký type 2
        </motion.button>
      </div>

      {/* Danh sách thư nhỏ */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          justifyContent: "center",
        }}
      >
        {letters.map((letter) => (
          <motion.div
            key={letter.id}
            layoutId={`letter-${letter.id}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={{
              width: 280,
              height: 120,
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              padding: 20,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              userSelect: "none",
            }}
            onClick={() => requestOpenLetter(letter.id)}
            onMouseEnter={() => setHoveredId(letter.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <img
              src={loveIcon}
              alt="love icon"
              style={{ width: 40, height: 40, marginBottom: 10 }}
            />
            <h3 style={{ color: "#FF6B81" }}>Bức thư #{letter.id}</h3>
            {hoveredId === letter.id && (
  <button
    onClick={(e) => {
      e.stopPropagation(); // không mở thư
      handleDeleteLetter(letter.id);
    }}
    style={{
      position: "absolute",
      top: 8,
      right: 8,
      background: "rgba(255,255,255,0.8)",
      border: "none",
      borderRadius: "50%",
      padding: 6,
      cursor: "pointer",
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    }}
    title="Xóa thư"
  >
    🗑
  </button>
)}

          </motion.div>
        ))}
      </div>

      {/* Nếu đang chỉnh sửa thư mới, hiện form nhập nội dung */}
      {isEditing && (
        <div style={{ marginTop: 30, width: "100%", textAlign: "center" }}>
          <textarea
            value={newLetterMessage}
            onChange={(e) => setNewLetterMessage(e.target.value)}
            placeholder="Nhập nội dung bức thư..."
            style={{
              width: "80%",
              height: 200,
              padding: 10,
              fontSize: 16,
              fontFamily: "'Quicksand', sans-serif",
              borderRadius: 8,
              border: "1.5px solid #FF6B81",
              resize: "none",
              marginBottom: 20,
            }}
          />
          <div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={saveNewLetter}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border:0,
                backgroundColor: "#FF6B81",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                marginRight: 10,
                transition: "all 0.3s ease",
              }}
            >
              Lưu bức thư
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(false)}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                backgroundColor: "#5D3A87",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                border:0,
                transition: "all 0.3s ease",
              }}
            >
              Hủy
            </motion.button>
          </div>
        </div>
      )}
      {/* Modal nhập mật khẩu */}
      <AnimatePresence>
        {awaitingPasswordId !== null && (
          <motion.div
            key="password-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1100,
              padding: 20,
            }}
            onClick={() => {
              setAwaitingPasswordId(null);
              setPasswordError("");
              setPasswordInput("");
            }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                backgroundColor: "white",
                borderRadius: 12,
                padding: 30,
                width: 320,
                boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
                textAlign: "center",
                fontFamily: "'Quicksand', sans-serif",
              }}
            >
              <h3 style={{ marginBottom: 20, color: "#FF4A6E" }}>
                Nhập mật khẩu để mở thư
              </h3>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Nhập mật khẩu"
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: 16,
                  borderRadius: 8,
                  border: "2px solid #FF4A6E",
                  outline: "none",
                  marginBottom: 10,
                }}
                autoFocus
              />
              {passwordError && (
                <div style={{ color: "red", marginBottom: 10 }}>
                  {passwordError}
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={verifyPassword}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#FF6B81",
                  color: "white",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Mở thư
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setAwaitingPasswordId(null);
                  setPasswordError("");
                  setPasswordInput("");
                }}
                style={{
                  marginTop: 12,
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#ccc",
                  color: "#333",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Hủy
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal bức thư lớn */}
      <AnimatePresence>
        {openLetterData && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              padding: 20,
            }}
            onClick={closeLetter}
          >
            <motion.div
              layoutId={`letter-${openLetterData.id}`}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, rotateX: 90, opacity: 0 }}
              animate={{ scale: 1, rotateX: 0, opacity: 1 }}
              exit={{ scale: 0.8, rotateX: 90, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                backgroundColor: "#fff8f9",
                width: 500,
                maxWidth: "90vw",
                padding: 30,
                borderRadius: 12,
                boxShadow:
                  "0 5px 15px rgba(0,0,0,0.3), inset 0 20px 30px rgba(255,255,255,0.6)",
                position: "relative",
                fontFamily: "'Dancing Script', cursive",
                color: "#b33951",
                cursor: "auto",
                perspective: 1000,
                borderLeft: "5px solid #d66a6a",
                borderBottom: "5px solid #d66a6a",
                userSelect: "text",
              }}
            >
              {/* Nếp gấp góc dưới phải */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 60,
                  height: 60,
                  background:
                    "linear-gradient(135deg, #fff8f9 0%, #d66a6a 100%)",
                  clipPath: "polygon(0 100%, 100% 0, 100% 100%)",
                  boxShadow:
                    "inset -5px -5px 8px rgba(255,255,255,0.8), 5px 5px 8px rgba(0,0,0,0.1)",
                  borderRadius: "0 0 12px 0",
                  pointerEvents: "none",
                }}
              />

              <h2 style={{ textAlign: "center", marginBottom: 20 }}>
                Bức thư #{openLetterData.id}
              </h2>
              <textarea
                value={openLetterData.message}
                onChange={(e) => {
                  const newLetters = letters.map((l) =>
                    l.id === openLetterData.id
                      ? { ...l, message: e.target.value }
                      : l
                  );
                  setLetters(newLetters);
                }}
                style={{
                  width: "100%",
                  height: 300,
                  resize: "none",
                  border: "none",
                  outline: "none",
                  fontSize: 20,
                  lineHeight: 1.5,
                  fontFamily: "'Dancing Script', cursive",
                  background: "transparent",
                  color: "#b33951",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
