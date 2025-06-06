import { useState } from 'react'

export default function Home() {
  const [artist, setArtist] = useState('')
  const [title, setTitle] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResults([])

    try {
      const query = new URLSearchParams()
      if (artist) query.append('artist', artist)
      if (title) query.append('title', title)

      const res = await fetch(`/api/spotify?${query.toString()}`)
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setResults(data.recommendations || [])
      }
    } catch (err) {
      setError('Error fetching recommendations.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Artist Name</label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="e.g., Brooks & Dunn"
          />
        </div>
        <div>
          <label className="block font-medium">Song Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="e.g., Neon Moon"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Suggestions'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Recommended Songs:</h2>
          <ul className="space-y-2">
            {results.map((track) => (
              <li key={track.id} className="border p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <p className="font-medium">{track.name}</p>
                <p className="text-sm">{track.artist}</p>
                {track.preview_url && (
                  <audio controls src={track.preview_url} className="mt-1 w-full" />
                )}
                <a href={track.external_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm mt-1 inline-block">
                  View on Spotify
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
}
