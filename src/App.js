import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LoveAnniversary from "./components/LoveAnniversary";

import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import MemorySave from "./components/MemorySave";
import DiaryPage from "./components/DiaryPage";
import LoveLetter from "./components/LoveLetter";
import MemoryDetail from "./components/MemoryDetail";
const API_BASE = "https://682df035746f8ca4a47b44f1.mockapi.io/quaiuem/nhacnen";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dcupkaad1/upload";
const UPLOAD_PRESET = "tinh_yeu";
 
function App() {
  const [musicList, setMusicList] = useState([]);
  const [currentMusic, setCurrentMusic] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    fetch(API_BASE)
      .then((r) => r.json())
      .then((data) => {
        setMusicList(data);
        if (data.length) setCurrentMusic(data[0]);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (audioRef.current && currentMusic) {
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [currentMusic]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["audio/mpeg", "audio/wav", "audio/mp3", "audio/ogg"].includes(file.type)) {
      alert("Chỉ chấp nhận file mp3, wav, ogg...");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", UPLOAD_PRESET);

      const cloudRes = await fetch(CLOUDINARY_URL, { method: "POST", body: fd });
      if (!cloudRes.ok) throw new Error("Upload thất bại");
      const cloudData = await cloudRes.json();

      const saveRes = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cloudData.secure_url }),
      });
      if (!saveRes.ok) throw new Error("Lưu thất bại");
      const newMusic = await saveRes.json();

      setMusicList((p) => [...p, newMusic]);
      setCurrentMusic(newMusic);
      setIsPlaying(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteMusic = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa nhạc nền này?")) return;
    fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setMusicList((prev) => prev.filter((m) => m.id !== id));
        if (currentMusic?.id === id) {
          const remaining = musicList.filter((m) => m.id !== id);
          setCurrentMusic(remaining.length > 0 ? remaining[0] : null);
          setIsPlaying(false);
        }
      })
      .catch(() => alert("Lỗi khi xóa nhạc."));
  };

  return (
    <>
     
      <div
        
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 2000,
          background: "rgba(255 255 255 / 0.95)",
          borderRadius: 16,
          padding: 10,
          width: 120,
          fontFamily: "'Quicksand', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          boxShadow: "0 3px 10px rgba(167,107,207,0.3)",
        }}
      >
        {uploading ? (
          <small style={{ color: "#A76BCF", flex: 1, textAlign: "center" }}>
            Đang tải...
          </small>
        ) : currentMusic ? (
          <>
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              title={isPlaying ? "Tạm dừng" : "Phát"}
              style={{
                backgroundColor: "#A76BCF",
                border: "none",
                borderRadius: "50%",
                width: 36,
                height: 36,
                color: "white",
                fontSize: 18,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#7B4EBF")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#A76BCF")}
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>

            {/* Delete */}
            <button
  onClick={() => handleDeleteMusic(currentMusic.id)}
  title="Xóa nhạc"
  aria-label="Xóa nhạc"
  style={{
    backgroundColor: "#E74C3C",
    border: "none",
    borderRadius: "50%",
    width: 36,
    height: 36,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(194, 210, 240, 0.6)",
    transition: "background-color 0.3s ease",
    padding: 0,
  }}
  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C0392B")}
  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E74C3C")}
>
  <svg
    xmlns="https://media.istockphoto.com/id/1187525428/vi/vec-to/bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-m%C3%A0u-%C4%91%E1%BB%8F-d%C3%B2ng-th%C3%B9ng-r%C3%A1c-tr%C3%AAn-n%E1%BB%81n-tr%E1%BA%AFng-h%C3%ACnh-minh-h%E1%BB%8Da-vector-ki%E1%BB%83u-ph%E1%BA%B3ng-m%C3%A0u-%C4%91%E1%BB%8F.jpg?s=612x612&w=0&k=20&c=ia7Gv8NOG77KjZRf3dBEgo_BR8rmqtuRxDinl8_e874="
    viewBox="0 0 24 24"
    fill="white"
    width="20"
    height="20"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M3 6h18v2H3V6zm2 3h14v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9zm3 3v6h2v-6H8zm4 0v6h2v-6h-2zM9 4h6v2H9V4z" />
  </svg>
</button>


            {/* Upload new */}
            <label
              htmlFor="file-upload"
              title="Tải nhạc lên"
              style={{
                backgroundColor: "#F7B6D2",
                borderRadius: 6,
                color: "#7B4EBF",
                fontSize: 18,
                cursor: "pointer",
                padding: "6px 8px",
                userSelect: "none",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F491C1")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#F7B6D2")}
            >
              ⬆️
            </label>
            <input
              id="file-upload"
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              disabled={uploading}
            />
          </>
        ) : (
          // Khi chưa có nhạc nền nào
          <>
            <label
              htmlFor="file-upload"
              title="Tải nhạc lên"
              style={{
                backgroundColor: "#F7B6D2",
                borderRadius: 16,
                color: "#7B4EBF",
                fontSize: 18,
                cursor: "pointer",
                padding: "8px 12px",
                userSelect: "none",
                width: "100%",
                textAlign: "center",
                fontWeight: "700",
                transition: "background-color 0.3s",
                display: "block",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F491C1")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#F7B6D2")}
            >
              Tải nhạc lên
            </label>
            <input
              id="file-upload"
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              disabled={uploading}
            />
          </>
        )}
      </div>

      <audio
        ref={audioRef}
        style={{ display: "none" }}
        loop
        src={currentMusic?.url || null}
        onEnded={() => setIsPlaying(false)}
      >
        Trình duyệt không hỗ trợ audio.
      </audio>
        
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/love" element={<LoveAnniversary />} />

            <Route path="/entry" element={<LoveLetter />} />
            <Route path="/memory" element={<MemorySave />} />
            <Route path="/diary" element={<DiaryPage />} />
            <Route path="/memory/:id" element={<MemoryDetail />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </>
  );
}

export default App;
