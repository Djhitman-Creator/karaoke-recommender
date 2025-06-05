
import React, { useState } from "react";

export default function KaraokeKeyApp() {
  const [songTitle, setSongTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [results, setResults] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("karaoke-dark-mode");
    if (savedTheme !== null) return savedTheme === "true";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const handleSearch = () => {
    const sampleSongs = Array.from({ length: 30 }).map((_, i) => ({
      title: `Suggested Song ${i + 1}`,
      artist: `Artist ${i + 1}`,
    }));

    setResults({
      key: "C Major",
      vocalRange: "Tenor (C3 - A4)",
      similarSongs: sampleSongs,
    });
  };

  const bgColor = darkMode ? "#1a1a1a" : "#fff";
  const textColor = darkMode ? "#f0f0f0" : "#2b2b2b";
  const cardBg = darkMode ? "#2a2a2a" : "#f9f9f9";
  const borderColor = darkMode ? "#444" : "#ccc";

  return (
    <div style={{ minHeight: "100vh", background: bgColor, color: textColor, padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "800px", margin: "0 auto 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img src="/KH DJ BOOTH LOGO LARGE.png" alt="Karaoke Houston Logo" style={{ height: "8rem" }} />
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

      {showDescription && (
        <div style={{ maxWidth: "600px", margin: "0 auto 1rem", padding: "1rem", border: `1px solid ${borderColor}`, borderRadius: "10px", background: cardBg }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Welcome to Our Song Recommender</h2>
          <p>
            Enter one of your favorite songs to sing, and we’ll provide a curated list of other songs in the same key and vocal range — helping you discover new songs that suit your voice and style.
          </p>
          <button onClick={() => setShowDescription(false)} style={{ marginTop: "1rem", color: "#fff", background: "#d42900", border: "none", padding: "0.5rem 1rem", borderRadius: "5px" }}>Close</button>
        </div>
      )}

      <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <p style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Enter a song you are comfortable singing.</p>
        <input
          placeholder="Enter Song Title"
          value={songTitle}
          onChange={(e) => setSongTitle(e.target.value)}
          style={{ border: "1px solid #d42900", padding: "0.5rem", borderRadius: "5px", background: darkMode ? "#333" : "#fff", color: textColor }}
        />
        <input
          placeholder="Enter Artist Name"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          style={{ border: "1px solid #d42900", padding: "0.5rem", borderRadius: "5px", background: darkMode ? "#333" : "#fff", color: textColor }}
        />

        <button onClick={handleSearch} style={{ background: "#d42900", color: "#fff", padding: "0.75rem", borderRadius: "5px", border: "none" }}>
          Find Songs in Same Key
        </button>

        {results && (
          <div style={{ marginTop: "2rem", border: `1px solid ${borderColor}`, padding: "1rem", borderRadius: "10px", background: cardBg }}>
            <p><strong>Detected Key:</strong> {results.key}</p>
            <p><strong>Estimated Vocal Range:</strong> {results.vocalRange}</p>
            <p><strong>Similar Songs:</strong></p>
            <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem" }}>
              {results.similarSongs.map((song, idx) => (
                <li key={idx} style={{ marginBottom: "1rem" }}>
                  <div><strong>{song.title}</strong> by {song.artist}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
