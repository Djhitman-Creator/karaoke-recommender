
import React, { useState, useEffect } from "react";
import Papa from "papaparse";

export default function KaraokeKeyApp() {
  const [songTitle, setSongTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [results, setResults] = useState(null);
  const [affiliateData, setAffiliateData] = useState([]);
  const [genres, setGenres] = useState([]);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    fetch("/affiliate-data.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data;
            setAffiliateData(data);
            const uniqueGenres = [...new Set(data.map((item) => item.genre).filter(Boolean))];
            setGenres(uniqueGenres);
          },
        });
      });
  }, []);

  const handleSearch = async () => {
    let recommendedSongs = Array.from({ length: 30 }, (_, i) => ({
      title: `Song ${i + 1}`,
      artist: `Artist ${i + 1}`,
    }));

    const enriched = recommendedSongs.map((song) => {
      const match = affiliateData.find(
        (item) =>
          item.song?.toLowerCase() === song.title.toLowerCase() &&
          item.artist?.toLowerCase() === song.artist.toLowerCase() &&
          (!genreFilter || item.genre === genreFilter)
      );
      return {
        ...song,
        url: match?.url || null,
        preview: match?.preview || null,
        genre: match?.genre || null,
      };
    });

    setResults({
      key: "C Major",
      vocalRange: "Tenor (C3 - A4)",
      similarSongs: enriched,
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#2b2b2b", padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "800px", margin: "0 auto 1.5rem" }}>
        <img src="/KH DJ BOOTH LOGO LARGE.png" alt="Karaoke Houston Logo" style={{ height: "8rem" }} />
        <button onClick={() => setShowDescription(true)} style={{ marginLeft: "1rem", color: "#d42900", border: "1px solid #d42900", padding: "0.5rem 1rem", background: "transparent", borderRadius: "5px" }}>What is this?</button>
      </div>

      {showDescription && (
        <div style={{ maxWidth: "600px", margin: "0 auto 1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "10px", background: "#f9f9f9" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Welcome to Our Song Recommender</h2>
          <p>
            Enter one of your favorite songs to sing, and we’ll provide a curated list of other songs in the same key and vocal range — helping you discover new songs that suit your voice and style.
          </p>
          <button onClick={() => setShowDescription(false)} style={{ marginTop: "1rem", color: "#fff", background: "#d42900", border: "none", padding: "0.5rem 1rem", borderRadius: "5px" }}>Close</button>
        </div>
      )}

      <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          placeholder="Enter Song Title"
          value={songTitle}
          onChange={(e) => setSongTitle(e.target.value)}
          style={{ border: "1px solid #d42900", padding: "0.5rem", borderRadius: "5px" }}
        />
        <input
          placeholder="Enter Artist Name"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          style={{ border: "1px solid #d42900", padding: "0.5rem", borderRadius: "5px" }}
        />
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          style={{ border: "1px solid #d42900", padding: "0.5rem", borderRadius: "5px" }}
        >
          <option value="">All Genres</option>
          {genres.map((genre, idx) => (
            <option key={idx} value={genre}>{genre}</option>
          ))}
        </select>

        <button onClick={handleSearch} style={{ background: "#d42900", color: "#fff", padding: "0.75rem", borderRadius: "5px", border: "none" }}>
          Find Songs in Same Key
        </button>

        {results && (
          <div style={{ marginTop: "2rem", border: "1px solid #ccc", padding: "1rem", borderRadius: "10px" }}>
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
