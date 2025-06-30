// DiaryPageSwiper.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { EffectCoverflow } from "swiper/modules";
// import InteractiveParticles from "./InteractiveParticles";
import { useNavigate } from "react-router-dom";
import flowerBg from "./assets/form.jpg";

const API_URL = "https://669524ab4bd61d8314ca3810.mockapi.io/api/v1/lathu";




export default function DiaryPageSwiper() {
  const [entries, setEntries] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formEntry, setFormEntry] = useState({ date: "", text: "", image: "" });

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setEntries(data))
      .catch((err) => {
        console.error("Failed to load entries", err);
        setEntries([]);
      });
  }, []);
  
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);

  const handleDelete = (id) => {
  if (window.confirm("Bạn có chắc muốn xóa kỷ niệm này?")) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => {
        setEntries((prev) => prev.filter((e) => e.id !== id));
      });
  }
};

  const selectedEntry = entries.find((e) => e.id === selectedId);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formEntry.date || !formEntry.text.trim()) return;
    if (isEditing && selectedEntry) {
      fetch(`${API_URL}/${selectedEntry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formEntry),
      })
        .then((res) => res.json())
        .then((updated) => {
          setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
          setSelectedId(updated.id);
          setShowForm(false);
          setIsEditing(false);
        });
    } else {
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formEntry),
      })
        .then((res) => res.json())
        .then((created) => {
          setEntries((prev) => [...prev, created]);
          setSelectedId(created.id);
          setShowForm(false);
          setIsEditing(false);
        });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fce3ec 0%, #fccde2 100%)",
        fontFamily: "'Quicksand', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#7D4B94",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* <InteractiveParticles /> */}

      <h2
        style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: 36,
          marginBottom: 40,
          zIndex: 5,
        }}
      >
        Kỷ niệm yêu thương 🎠
      </h2>
<button
  onClick={() => navigate("/entry")}
  style={{
    position: "fixed",
    top:10,
    left: 30,
    padding: "14px 28px",
    fontSize: 20,
    borderRadius: 9999,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    color: "#fff",
    fontFamily: "'Dancing Script', cursive",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15), 0 0 10px rgba(255, 174, 188, 0.5)",
    transition: "all 0.3s ease",
    zIndex: 999,
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
>
  💖 Home
</button>

      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        coverflowEffect={{ rotate: 30, stretch: 0, depth: 100, modifier: 1, slideShadows: true }}
        modules={[EffectCoverflow]}
        style={{ width: "90%", paddingBottom: 80, zIndex: 5 }}
      >
        {entries.map((entry) => (
          <SwiperSlide
  key={entry.id}
  style={{
    background: "#fff",
    borderRadius: 20,
    width: 250,
    padding: 15,
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    textAlign: "center",
    cursor: "pointer",
    position: "relative",
  }}
  onClick={() => navigate(`/memory/${entry.id}`)}
  onMouseEnter={() => setHoveredId(entry.id)}
  onMouseLeave={() => setHoveredId(null)}
  

>
  <img
    src={entry.image || "https://via.placeholder.com/250x180.png?text=Memory"}
    alt={entry.date}
    style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 15, marginBottom: 10 }}
  />

  {/* Biểu tượng xóa */}
  {hoveredId === entry.id && (
  <div style={{ position: "absolute", bottom: 20, right: 20, display: "flex", gap: 8 }}>
    <button
      onClick={(e) => {
        e.stopPropagation();
        setSelectedId(entry.id);
        setFormEntry({ date: entry.date, text: entry.text, image: entry.image });
        setShowForm(true);
        setIsEditing(true);
      }}
      style={{
        background: "rgba(255, 255, 255, 0.8)",
        border: "none",
        borderRadius: "50%",
        padding: 8,
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      }}
      title="Chỉnh sửa"
    >
      ✏️
    </button>

    <button
      onClick={(e) => {
        e.stopPropagation();
        if (window.confirm("Bạn có chắc muốn xóa kỷ niệm này?")) {
          fetch(`${API_URL}/${entry.id}`, { method: "DELETE" })
            .then(() => setEntries((prev) => prev.filter((e) => e.id !== entry.id)));
        }
      }}
      style={{
        background: "rgba(255, 255, 255, 0.8)",
        border: "none",
        borderRadius: "50%",
        padding: 8,
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      }}
      title="Xóa"
    >
      🗑
    </button>
  </div>
)}


  <h4 style={{ fontFamily: "'Dancing Script'", color: "#7D4B94" }}>{entry.date}</h4>
          </SwiperSlide>

        ))}
      </Swiper>

      <AnimatePresence>
  {selectedEntry && !showForm && (
    <motion.div
      key="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={() => setSelectedId(null)} // Bấm nền là đóng
    >
      <motion.div
        key={selectedEntry.id}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "white",
          borderRadius: 20,
          padding: 25,
          boxShadow: "0 10px 25px rgba(212,165,240,0.35)",
          color: "#512da8",
          textAlign: "left",
          maxWidth: 500,
          width: "90%",
          zIndex: 25,
        }}
        onClick={(e) => e.stopPropagation()} // Chặn sự kiện đóng khi bấm trong popup
      >
        <h3 style={{ fontFamily: "'Dancing Script'", fontSize: 28 }}>
          Kỷ niệm ngày {selectedEntry.date}
        </h3>
        <p style={{ fontSize: 18, whiteSpace: "pre-line" }}>
          {selectedEntry.text}
        </p>
        {selectedEntry.image && (
          <img
            src={selectedEntry.image}
            alt={selectedEntry.date}
            style={{
              marginTop: 20,
              width: "100%",
              objectFit: "contain",
              borderRadius: 15,
            }}
          />
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
          <button
            onClick={() => {
              setShowForm(true);
              setIsEditing(true);
            }}
            style={{
              flex: 1,
              padding: "10px 0",
              backgroundColor: "#FF9AA2",
              color: "white",
              border: "none",
              borderRadius: 10,
            }}
          >
            Sửa
          </button>
          <button
            onClick={() => setSelectedId(null)}
            style={{
              flex: 1,
              padding: "10px 0",
              backgroundColor: "#aaa",
              color: "white",
              border: "none",
              borderRadius: 10,
            }}
          >
            Đóng
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


<AnimatePresence>
  {showForm && (
    <motion.form
      onSubmit={handleFormSubmit}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        position: "fixed",
        top: "22%",
        
        transform: "translate(-50%, -50%)",
        background: "#fff",
        backgroundImage: `url(${flowerBg})`, // hình nền hoa (nhẹ), thêm vào thư mục public
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        padding: 30,
        borderRadius: 20,
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        zIndex: 999,
        display: "flex",
        flexDirection: "column",
        gap: 18,
        width: 500,
        maxWidth: "90vw",
        fontFamily: "'Quicksand', cursive",
        border: "4px solid #ffb6c1",
      }}
    >
      <h2 style={{ color: "#c2185b", textAlign: "center", marginBottom: 10 }}>
        💖 Ghi lại kỷ niệm yêu thương 💖
      </h2>

      <div>
        <label style={{ fontWeight: "bold", color: "#b30059", display: "block", marginBottom: 5 }}>📅 Ngày kỷ niệm</label>
        <input
          name="date"
          type="date"
          value={formEntry.date}
          onChange={handleFormChange}
          required
          style={{
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ccc",
            width: "100%",
            fontSize: 16,
          }}
        />
      </div>

      <div>
        <label style={{ fontWeight: "bold", color: "#b30059", display: "block", marginBottom: 5 }}>📝 Nội dung kỷ niệm</label>
        <textarea
          name="text"
          rows={4}
          value={formEntry.text}
          onChange={handleFormChange}
          required
          style={{
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ccc",
            width: "100%",
            fontSize: 16,
            resize: "vertical",
          }}
        />
      </div>

      <div>
        <label style={{ fontWeight: "bold", color: "#b30059", display: "block", marginBottom: 5 }}>🌈 URL ảnh (tuỳ chọn)</label>
        <input
          name="image"
          type="text"
          value={formEntry.image}
          onChange={handleFormChange}
          placeholder="https://..."
          style={{
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ccc",
            width: "100%",
            fontSize: 16,
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 15 }}>
        <button
          type="submit"
          style={{
            flex: 1,
            padding: 12,
            background: "linear-gradient(to right, #ff7eb3, #ff758c)",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontWeight: "bold",
            fontSize: 16,
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          {isEditing ? "💾 Lưu" : "➕ Thêm yêu thương"}
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          style={{
            flex: 1,
            padding: 12,
            background: "#aaa",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontWeight: "bold",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          ❌ Hủy
        </button>
      </div>
    </motion.form>
  )}
</AnimatePresence>



      {!showForm && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => {
            setFormEntry({ date: "", text: "", image: "" });
            setSelectedId(null);
            setIsEditing(false);
            setShowForm(true);
          }}
          style={{
            position: "fixed",
            bottom: 30,
            right: 30,
            backgroundColor: "#FF4A6E",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: 60,
            height: 60,
            fontSize: 30,
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            cursor: "pointer",
          }}
        >
          +
        </motion.button>
      )}
    </div>
  );
}
