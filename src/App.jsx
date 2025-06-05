
import React, { useState, useEffect } from "react";
import Papa from "papaparse";

export default function KaraokeKeyApp() {
  const [songTitle, setSongTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [results, setResults] = useState(null);
  const [affiliateData, setAffiliateData] = useState([]);
  const [showDescription, setShowDescription] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference or system preference on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem("karaoke-dark-mode");
    if (savedTheme !== null) {
      setDarkMode(savedTheme === "true");
    } else {
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Save dark mode preference when changed
  useEffect(() => {
    localStorage.setItem("karaoke-dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    fetch("/affiliate-data.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setAffiliateData(results.data);
          },
        });
      });
  }, []);

  const handleSearch = async () => {
    // Reset results before generating new ones
    setResults(null);

    // Create a new shuffled copy to ensure randomness each time
    const shuffled = [...affiliateData].sort(() => 0.5 - Math.random());
    const recommendedSongs = shuffled.slice(0, 30);

    const enriched = recommendedSongs.map((song) => ({
      title: song.title || song.Title || song.song || "Unknown Title",
      artist: song.artist || song.Artist || "Unknown Artist",
      url: (() => {
        const raw = song.url || song.URL || "";
        return raw.startsWith("http") ? raw : `https://www.karaoke-version.com${raw}`;
      })(),
      preview: song.preview || song.Preview || null,
      genre: song.genre || song.Genre || null,
    }));

    setResults({
      key: "C Major",
      vocalRange: "Tenor (C3 - A4)",
      similarSongs: enriched,
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
          <button onClick={() => setDarkMode(!darkMode)} style={{ color: darkMode ? "#fff" : "#333", background: darkMode ? "#333" : "#eee", border: "1px solid #999", padding: "0.5rem 1rem", borderRadius: "5px" }}>
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
                  {song.genre && <div><em>Genre:</em> {song.genre}</div>}
                  {song.preview && (
                    <audio controls style={{ width: "100%" }}>
                      <source src={song.preview} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                  {song.url && (
                    <a href={song.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "0.25rem", color: "#d42900" }}>
                      🎧 View on Karaoke Version
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
