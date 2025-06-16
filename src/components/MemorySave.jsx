import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import loveLetter from "./assets/z6619465197701_d1bb106b337f232289327ee834b6890e.jpg";
const API_URL = "https://669524ab4bd61d8314ca3810.mockapi.io/api/v1/VyDangIu";

const buttonBaseStyle = {
  padding: "10px 24px",
  borderRadius: 20,
  fontWeight: "700",
  cursor: "pointer",
  fontFamily: "'Dancing Script', cursive",
  userSelect: "none",
  transition: "all 0.3s ease",
};

const formatMonth = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
const displayMonth = (monthStr) => {
  const [year, month] = monthStr.split("-");
  return `Tháng ${Number(month)}, ${year}`;
};
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

function BackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const particlesCount = 80;

    const particles = [];

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: random(0, width),
        y: random(0, height),
        size: random(2, 5),
        speedX: random(-0.8, 0.8),
        speedY: random(-0.8, 0.8),
        alpha: random(0.5, 1),
        alphaSpeed: random(0.005, 0.015),
        increasing: true,
      });
    }

    let animationFrameId;

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > width) p.speedX *= -1;
        if (p.y < 0 || p.y > height) p.speedY *= -1;

        if (p.increasing) {
          p.alpha += p.alphaSpeed;
          if (p.alpha >= 1) p.increasing = false;
        } else {
          p.alpha -= p.alphaSpeed;
          if (p.alpha <= 0.5) p.increasing = true;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 74, 110, ${p.alpha})`;
        ctx.shadowColor = `rgba(255, 74, 110, ${p.alpha})`;
        ctx.shadowBlur = 12;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    function onResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        userSelect: "none",
      }}
    />
  );
}

export default function DiaryLoveSlideWithCRUD() {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [zoomedImg, setZoomedImg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [addingNew, setAddingNew] = useState(false);

  const [editEntryData, setEditEntryData] = useState({
    date: "",
    text: "",
    images: ["", "", "", ""],
  });

  const [newEntryData, setNewEntryData] = useState({
    date: "",
    text: "",
    images: ["", "", "", ""],
  });

  // Load dữ liệu từ API khi component mount
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const processed = data.map((item) => ({
          ...item,
          images: item.images || [],
        }));
        setEntries(processed);
      })
      .catch((err) => {
        console.error("Failed to fetch entries:", err);
        setEntries([]);
      });
  }, []);

  const months = useMemo(() => {
    const setMonths = new Set(entries.map((e) => formatMonth(e.date)));
    return Array.from(setMonths).sort((a, b) => (a < b ? 1 : -1));
  }, [entries]);

  useEffect(() => {
    if (!selectedMonth && months.length > 0) {
      setSelectedMonth(months[0]);
    }
  }, [months, selectedMonth]);

  const entriesInMonth = useMemo(() => {
    if (!selectedMonth) return [];
    return entries
      .filter((e) => formatMonth(e.date) === selectedMonth)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [entries, selectedMonth]);

  useEffect(() => {
    if (selectedEntry) {
      setIsEditing(false);
      setEditEntryData({
        date: selectedEntry.date,
        text: selectedEntry.text,
        images: [...selectedEntry.images, "", "", "", ""].slice(0, 4),
      });
    }
  }, [selectedEntry]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("image")) {
      const idx = Number(name.split("-")[1]);
      setEditEntryData((prev) => {
        const newImages = [...prev.images];
        newImages[idx] = value;
        return { ...prev, images: newImages };
      });
    } else {
      setEditEntryData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // PUT sửa entry
  const saveEdit = () => {
    if (!editEntryData.date || !editEntryData.text.trim()) {
      alert("Ngày và nội dung không được để trống!");
      return;
    }
    const validImages = editEntryData.images.filter((img) => img.trim() !== "").slice(0, 4);

    fetch(`${API_URL}/${selectedEntry.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: editEntryData.date,
        text: editEntryData.text,
        images: validImages,
      }),
    })
      .then((res) => res.json())
      .then((updatedEntry) => {
        setEntries((prev) =>
          prev.map((e) => (e.id === selectedEntry.id ? updatedEntry : e))
        );
        setSelectedEntry(updatedEntry);
        setIsEditing(false);
      })
      .catch((err) => {
        console.error("Failed to update entry:", err);
        alert("Lỗi khi cập nhật kỷ niệm.");
      });
  };

  // DELETE xóa entry
  const deleteEntry = () => {
    if (!selectedEntry) return;
    if (window.confirm(`Bạn có chắc muốn xóa kỷ niệm ngày ${selectedEntry.date} không?`)) {
      fetch(`${API_URL}/${selectedEntry.id}`, {
        method: "DELETE",
      })
        .then(() => {
          setEntries((prev) => prev.filter((e) => e.id !== selectedEntry.id));
          setSelectedEntry(null);
          setIsEditing(false);
        })
        .catch((err) => {
          console.error("Failed to delete entry:", err);
          alert("Lỗi khi xóa kỷ niệm.");
        });
    }
  };

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("image")) {
      const idx = Number(name.split("-")[1]);
      setNewEntryData((prev) => {
        const newImages = [...prev.images];
        newImages[idx] = value;
        return { ...prev, images: newImages };
      });
    } else {
      setNewEntryData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // POST thêm mới entry
  const saveNew = () => {
    if (!newEntryData.date || !newEntryData.text.trim()) {
      alert("Ngày và nội dung không được để trống!");
      return;
    }
    const validImages = newEntryData.images.filter((img) => img.trim() !== "").slice(0, 4);
    const postData = {
      date: newEntryData.date,
      text: newEntryData.text,
      images: validImages,
    };
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    })
      .then((res) => res.json())
      .then((createdEntry) => {
        setEntries((prev) => [...prev, createdEntry]);
        setSelectedEntry(createdEntry);
        setSelectedMonth(formatMonth(createdEntry.date));
        setAddingNew(false);
        setNewEntryData({ date: "", text: "", images: ["", "", "", ""] });
      })
      .catch((err) => {
        console.error("Failed to add entry:", err);
        alert("Lỗi khi thêm kỷ niệm.");
      });
  };

  return (
    <>
      <Helmet>
        <title>Nhật ký yêu thương - DiaryLove</title>
      </Helmet>
      <h1
        style={{
          textAlign: "center",
          padding: 20,
          color: "#FF4A6E",
          fontFamily: "'Dancing Script', cursive",
          userSelect: "none",
        }}
      >
        💌 Nhật ký yêu thương
      </h1>
      <BackgroundCanvas />

      {/* Thanh chọn tháng */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          padding: "20px",
          gap: 12,
          userSelect: "none",
          fontFamily: "'Quicksand', sans-serif",
          fontWeight: "700",
          color: "#9B2C58",
          position: "relative",
          zIndex: 10,
        }}
      >
        {months.map((month) => (
          <div
            key={month}
            onClick={() => setSelectedMonth(month)}
            style={{
              cursor: "pointer",
              padding: "8px 16px",
              borderRadius: 20,
              backgroundColor: month === selectedMonth ? "#FF4A6E" : "#FFD6E8",
              color: month === selectedMonth ? "white" : "#9B2C58",
              whiteSpace: "nowrap",
              boxShadow:
                month === selectedMonth
                  ? "0 0 12px rgba(255,74,110,0.9)"
                  : "none",
              flexShrink: 0,
              userSelect: "none",
            }}
          >
            {displayMonth(month)}
          </div>
        ))}

        <motion.button
          onClick={() => {
            setAddingNew(true);
            setSelectedEntry(null);
            setIsEditing(false);
            setNewEntryData({ date: "", text: "", images: ["", "", "", ""] });
          }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px #FF4A6E" }}
          whileTap={{ scale: 0.95 }}
          style={{
            marginLeft: "auto",
            padding: "10px 24px",
            borderRadius: 20,
            border: "none",
            backgroundColor: "#FF4A6E",
            color: "white",
            fontWeight: "700",
            cursor: "pointer",
            flexShrink: 0,
            userSelect: "none",
            boxShadow: "0 4px 12px rgba(255, 74, 110, 0.8)",
            fontFamily: "'Dancing Script', cursive",
            transition: "background-color 0.3s ease",
            overflow: "hidden",
          }}
          title="Thêm kỷ niệm mới"
        >
          + Thêm
        </motion.button>
      </div>

      {/* Danh sách thư nhỏ ngang */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          padding: 20,
          gap: 16,
          flexShrink: 0,
          userSelect: "none",
          position: "relative",
          zIndex: 10,
        }}
      >
        {entriesInMonth.length === 0 && (
          <p style={{ color: "#9B2C58", marginLeft: 20 }}>
            Không có kỷ niệm tháng này.
          </p>
        )}

        {entriesInMonth.map((entry) => (
          <motion.div
            key={entry.id}
            whileHover={{ scale: 1.05, boxShadow: "0 0 12px rgba(255,74,110,0.6)" }}
            onClick={() => {
              setSelectedEntry(entry);
              setIsEditing(false);
              setAddingNew(false);
            }}
            style={{
              minWidth: 140,
              height: 120,
              backgroundColor: "#FFDEEB",
              borderRadius: 16,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              position: "relative",
              overflow: "hidden",
              userSelect: "none",
            }}
            title={entry.text.slice(0, 50)}
          >
              <motion.img
              src={loveLetter}
              alt="Love letter"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />

            <div
              style={{
                position: "absolute",
                bottom: 8,
                fontSize: 12,
                color: "#C2185B",
                fontWeight: "600",
              }}
            >
              {formatDate(entry.date)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal chi tiết kỷ niệm */}
      <AnimatePresence>
        {(selectedEntry || addingNew) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSelectedEntry(null);
              setIsEditing(false);
              setAddingNew(false);
            }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              padding: 20,
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "#FFF0F5",
                borderRadius: 20,
                padding: 30,
                maxWidth: "58vw",
                maxHeight: "80vh",
                overflowY: "auto",
                boxShadow: "0 8px 25px rgba(255, 74, 110, 0.5)",
                fontFamily: "'Dancing Script', cursive",
                color: "#7D4B94",
                userSelect: "text",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                position: "relative",
              }}
            >
              {(isEditing || addingNew) ? (
                <>
                  <label style={{ fontWeight: "700", fontSize: 16 }}>
                    Ngày:
                    <input
                      type="date"
                      name="date"
                      value={addingNew ? newEntryData.date : editEntryData.date}
                      onChange={addingNew ? (e) => {
                        const { name, value } = e.target;
                        if (name.startsWith("image")) return;
                        setNewEntryData((prev) => ({ ...prev, [name]: value }));
                      } : handleEditChange}
                      style={{
                        width: "100%",
                        padding: 8,
                        marginTop: 6,
                        marginBottom: 12,
                        borderRadius: 10,
                        border: "2px solid #F8A1C5",
                        outline: "none",
                        fontFamily: "'Quicksand', sans-serif",
                        fontSize: 16,
                        color: "#9B2C58",
                      }}
                    />
                  </label>

                  <label style={{ fontWeight: "700", fontSize: 16 }}>
                    Dòng tâm sự:
                    <textarea
                      name="text"
                      value={addingNew ? newEntryData.text : editEntryData.text}
                      onChange={addingNew ? (e) => {
                        const { name, value } = e.target;
                        if (name.startsWith("image")) return;
                        setNewEntryData((prev) => ({ ...prev, text: value }));
                      } : handleEditChange}
                      rows={6}
                      style={{
                        width: "100%",
                        padding: 10,
                        marginTop: 6,
                        marginBottom: 12,
                        borderRadius: 10,
                        border: "2px solid #F8A1C5",
                        outline: "none",
                        fontFamily: "'Quicksand', sans-serif",
                        fontSize: 16,
                        color: "#9B2C58",
                        resize: "vertical",
                      }}
                    />
                  </label>

                  <label style={{ fontWeight: "700", fontSize: 16 }}>
                    Ảnh (URL, tối đa 4 ảnh):
                    {[0, 1, 2, 3].map((idx) => (
                      <input
                        key={idx}
                        type="text"
                        name={`image-${idx}`}
                        value={addingNew ? newEntryData.images[idx] : editEntryData.images[idx]}
                        onChange={addingNew ? (e) => {
                          const idx = Number(e.target.name.split("-")[1]);
                          const val = e.target.value;
                          setNewEntryData((prev) => {
                            const newImgs = [...prev.images];
                            newImgs[idx] = val;
                            return { ...prev, images: newImgs };
                          });
                        } : handleEditChange}
                        placeholder={`Link ảnh thứ ${idx + 1}`}
                        style={{
                          width: "100%",
                          padding: 8,
                          marginTop: 6,
                          marginBottom: 8,
                          borderRadius: 10,
                          border: "2px solid #F8A1C5",
                          outline: "none",
                          fontFamily: "'Quicksand', sans-serif",
                          fontSize: 16,
                          color: "#9B2C58",
                        }}
                      />
                    ))}
                  </label>

                  <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                    <motion.button
                      onClick={addingNew ? saveNew : saveEdit}
                      whileHover={{ scale: 1.05, boxShadow: "0 0 15px #FF9AA2" }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: "10px 24px",
                        borderRadius: 20,
                        backgroundColor: "#FF9AA2",
                        border: "none",
                        color: "white",
                        fontWeight: "700",
                        cursor: "pointer",
                        fontFamily: "'Dancing Script', cursive",
                        flex: 1,
                        userSelect: "none",
                      }}
                    >
                      {addingNew ? "Thêm" : "Lưu"}
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setIsEditing(false);
                        setAddingNew(false);
                      }}
                      whileHover={{ scale: 1.05, boxShadow: "0 0 15px #FF4A6E" }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: "10px 24px",
                        borderRadius: 20,
                        backgroundColor: "#FF4A6E",
                        border: "none",
                        color: "white",
                        fontWeight: "700",
                        cursor: "pointer",
                        fontFamily: "'Dancing Script', cursive",
                        flex: 1,
                        userSelect: "none",
                      }}
                    >
                      Hủy
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  <h3 style={{ textAlign: "center", color: "#FF4A6E" }}>
                    {formatDate(selectedEntry.date)}
                  </h3>
                  <p style={{ whiteSpace: "pre-line", fontSize: 18 }}>{selectedEntry.text}</p>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {selectedEntry.images.length === 0 && (
                      <div
                        style={{
                          width: 100,
                          height: 100,
                          backgroundColor: "#FFD6E8",
                          borderRadius: 12,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#C2185B",
                          fontWeight: "bold",
                          fontSize: 36,
                          userSelect: "none",
                        }}
                      >
                        ❤️
                      </div>
                    )}

                    {selectedEntry.images.map((img, i) => (
                      <motion.img
                        key={i}
                        src={img}
                        alt={`image-${i}`}
                        style={{
                          width: 200,
                          height: 200,
                          objectFit: "cover",
                          borderRadius: 12,
                          cursor: "pointer",
                          boxShadow: "0 3px 8px rgba(255,74,110,0.4)",
                        }}
                        whileHover={{ scale: 1.05, boxShadow: "0 0 10px #FF4A6E" }}
                        onClick={() => setZoomedImg(img)}
                      />
                    ))}
                  </div>

                  <div
                    style={{
                      marginTop: 20,
                      display: "flex",
                      gap: 12,
                      justifyContent: "center",
                    }}
                  >
                    <motion.button
                      onClick={() => setIsEditing(true)}
                      whileHover={{ scale: 1.05, boxShadow: "0 0 15px #FF9AA2" }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        ...buttonBaseStyle,
                        backgroundColor: "#FF9AA2",
                        color: "white",
                        border: "none",
                      }}
                    >
                      Sửa
                    </motion.button>
                    <motion.button
                      onClick={deleteEntry}
                      whileHover={{ scale: 1.05, boxShadow: "0 0 15px #FF4A6E" }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        ...buttonBaseStyle,
                        backgroundColor: "#FF4A6E",
                        color: "white",
                        border: "none",
                      }}
                    >
                      Xóa
                    </motion.button>
                  </div>
                </>
              )}

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 18px #FF4A6E" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedEntry(null);
                  setIsEditing(false);
                  setAddingNew(false);
                }}
                style={{
                  marginTop: 16,
                  padding: "12px 0",
                  borderRadius: 20,
                  backgroundColor: "#FF4A6E",
                  color: "white",
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                  width: "100%",
                  fontFamily: "'Dancing Script', cursive",
                  fontSize: 16,
                  maxWidth: "200px",
                  alignSelf: "center",
                  boxShadow: "0 5px 15px rgba(255, 74, 110, 0.8)",
                  userSelect: "none",
                  overflow: "hidden",
                  transition: "background-color 0.3s ease",
                  minHeight: "50px",
                }}
              >
                Đóng
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zoom ảnh fullscreen */}
      <AnimatePresence>
        {zoomedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImg(null)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1200,
              cursor: "zoom-out",
              userSelect: "none",
            }}
          >
            <motion.img
              src={zoomedImg}
              alt="zoomed"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              style={{ maxHeight: "90vh", maxWidth: "90vw", borderRadius: 20 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
