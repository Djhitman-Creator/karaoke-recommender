import React, { useState } from "react";

export default function KaraokeKeyApp() {
  const [songTitle, setSongTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [results, setResults] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("karaoke-dark-mode");
    if (savedTheme !== null) return savedTheme === "true";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const handleSearch = async () => {
    try {
      setLoading(true);
      const mbUrl = `https://musicbrainz.org/ws/2/recording?query=${encodeURIComponent(songTitle + ' ' + artistName)}&fmt=json`;
      const mbRes = await fetch(mbUrl);
      const mbData = await mbRes.json();
      const recording = mbData.recordings && mbData.recordings[0];

      if (!recording) {
        alert("No recording found for that song and artist.");
        setLoading(false);
        return;
      }

      const mbid = recording.id;
      const abUrl = `https://acousticbrainz.org/api/v1/${mbid}/low-level`; 
      const abRes = await fetch(abUrl);
      const abData = await abRes.json();

      const key = abData.tonal?.key_key || "Unknown";
      const scale = abData.tonal?.key_scale || "Unknown";
      const range = abData.lowlevel?.pitch_salience?.mean > 0.5 ? "Tenor (C3 - A4)" : "Baritone (A2 - G4)";

      const matchKey = `${key.toUpperCase()} ${scale}`;
      const suggestions = mbData.recordings.filter(r => r.id !== mbid).slice(0, 30).map(r => ({
        title: r.title,
        artist: r['artist-credit']?.[0]?.name || "Unknown"
      }));

      setResults({
        key: matchKey,
        vocalRange: range,
        similarSongs: suggestions.length > 0 ? suggestions : Array.from({ length: 30 }).map((_, i) => ({
          title: `Suggested Song ${i + 1}`,
          artist: `Artist ${i + 1}`
        }))
      });
    } catch (err) {
      console.error("Search failed:", err);
      alert("Something went wrong while fetching data. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const bgColor = darkMode ? "#1a1a1a" : "#fff";
  const textColor = darkMode ? "#f0f0f0" : "#2b2b2b";
  const cardBg = darkMode ? "#2a2a2a" : "#f9f9f9";
  const borderColor = darkMode ? "#444" : "#ccc";

  return (
    <div style={{ minHeight: "100vh", background: bgColor, color: textColor, padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "800px", margin: "0 auto 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img src="/KH%20DJ%20BOOTH%20LOGO%20LARGE.png" alt="Karaoke Houston Logo" style={{ height: "8rem" }} />
          <span style={{ fontSize: "1.5rem" }}>Find Your Next Hit!</span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={() => setShowDescription(true)} style={{ color: "#d42900", border: "1px solid #d42900", padding: "0.5rem 1rem", background: "transparent", borderRadius: "5px" }}>What is this?</button>
          <button onClick={() => {
            setDarkMode(!darkMode);
            localStorage.setItem("karaoke-dark-mode", !darkMode);
          }} style={{ color: darkMode ? "#fff" : "#333", background: darkMode ? "#333" : "#eee", border: "1px solid #999", padding: "0.5rem 1rem", borderRadius: "5px" }}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>
    </div>
  );
}
