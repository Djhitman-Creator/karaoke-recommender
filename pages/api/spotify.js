/**
 * Next.js API route handler for Spotify integration
 * - Searches track by title/artist
 * - Fetches audio features (key, mode)
 * - Gets artist genres
 * - Fetches recommendations based on key and seed track
 */

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

// Utility: get access token
async function getAccessToken() {
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const resp = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  })
  const data = await resp.json()
  return data.access_token
}

export default async function handler(req, res) {
  try {
    const { artist = '', title = '' } = req.query
    if (!artist && !title) {
      return res.status(400).json({ error: 'Please provide an artist or title.' })
    }

    const token = await getAccessToken()

    // 1. Search for track
    const queryParts = []
    if (title) queryParts.push(`track:${title}`)
    if (artist) queryParts.push(`artist:${artist}`)
    const query = queryParts.join(' ')
    const searchRes = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const searchData = await searchRes.json()
    if (!searchData.tracks.items.length) {
      return res.status(404).json({ error: 'Track not found on Spotify.' })
    }
    const track = searchData.tracks.items[0]
    const trackId = track.id
    const artistId = track.artists[0].id

    // 2. Get audio features
    const featuresRes = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const featuresData = await featuresRes.json()
    const { key, mode } = featuresData

    // 3. Get artist genres
    const artistRes = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const artistData = await artistRes.json()
    const genres = artistData.genres // array of genres

    // 4. Get recommendations
    const recommendationsRes = await fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${trackId}&target_key=${key}&target_mode=${mode}&limit=10`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const recData = await recommendationsRes.json()

    // Format response
    const recommendations = recData.tracks.map((t) => ({
      id: t.id,
      name: t.name,
      artist: t.artists.map((a) => a.name).join(', '),
      preview_url: t.preview_url,
      external_url: t.external_urls.spotify,
    }))

    return res.status(200).json({ recommendations })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Server error.' })
  }
}
