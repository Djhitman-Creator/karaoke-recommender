import { useState } from 'react';
import Layout from '../components/Layout';

export default function Home() {
  const [artist, setArtist] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!artist && !title) {
      setError('Please enter at least an artist or a song title.');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (artist) params.append('artist', artist);
      if (title) params.append('title', title);

      const res = await fetch(`/api/spotify?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
      } else {
        setResult(data);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <h2 className="text-2xl mb-4">Find Songs in Your Key & Genre</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block mb-1">Artist</label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="e.g. Adele"
            className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block mb-1">Song Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Rolling in the Deep"
            className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? 'Searching…' : 'Get Suggestions'}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {result && (
        <div className="space-y-6">
          <div className="border p-4 rounded bg-white dark:bg-gray-800">
            <h3 className="font-semibold mb-2">Your Input:</h3>
            <p>
              <strong>Track:</strong> {result.input.title} <br />
              <strong>Artist:</strong> {result.input.artist} <br />
              <strong>Key:</strong> {result.input.key} {result.input.mode === 1 ? 'Major' : 'Minor'} <br />
              <strong>Genres:</strong> {result.input.genres.length > 0 ? result.input.genres.join(', ') : 'N/A'}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Recommendations:</h3>
            {result.recommendations.length === 0 && <p>No recommendations found.</p>}
            {result.recommendations.map((track, idx) => (
              <div
                key={idx}
                className="border p-4 rounded bg-white dark:bg-gray-800 flex flex-col space-y-2"
              >
                <p><strong>{track.title}</strong> — {track.artist}</p>
                <p><strong>Key:</strong> {track.key} {track.mode === 1 ? 'Major' : 'Minor'}</p>
                {track.preview && (
                  <audio controls>
                    <source src={track.preview} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
                <a
                  href={track.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View on Spotify
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}