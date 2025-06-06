import fetch from 'node-fetch';

let cachedToken = null;
let tokenExpiresAt = 0;

async function getSpotifyAccessToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const creds = Buffer.from(`${id}:${secret}`).toString('base64');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  });
  const json = await res.json();
  cachedToken = json.access_token;
  tokenExpiresAt = now + json.expires_in * 1000 - 5000;
  return cachedToken;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET supported' });
  }

  const { artist = '', title = '' } = req.query;
  if (!artist && !title) {
    return res.status(400).json({ error: 'Provide artist and/or title' });
  }

  try {
    const token = await getSpotifyAccessToken();
    const query = encodeURIComponent(`${title} ${artist}`.trim());
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const searchJson = await searchRes.json();
    const track = searchJson.tracks.items[0];
    if (!track) {
      return res.status(404).json({ error: 'Track not found on Spotify' });
    }

    const trackId = track.id;
    const artistId = track.artists[0].id;

    const featuresRes = await fetch(
      `https://api.spotify.com/v1/audio-features/${trackId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const features = await featuresRes.json();
    const { key, mode } = features;

    const artistRes = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const artistJson = await artistRes.json();
    const genres = artistJson.genres;
    const primaryGenre = genres.length > 0 ? genres[0] : null;

    let recURL = `https://api.spotify.com/v1/recommendations?seed_tracks=${trackId}&limit=10&target_key=${key}&target_mode=${mode}`;
    if (primaryGenre) {
      recURL += `&seed_genres=${primaryGenre.replace(/\s+/g, '-')}`;
    }

    const recRes = await fetch(recURL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const recJson = await recRes.json();
    const recTracks = recJson.tracks.map((t) => ({
      title: t.name,
      artist: t.artists.map((a) => a.name).join(', '),
      key: t.key,
      mode: t.mode,
      preview: t.preview_url,
      spotifyUrl: t.external_urls.spotify,
    }));

    return res.status(200).json({
      input: {
        title: track.name,
        artist: track.artists.map((a) => a.name).join(', '),
        key,
        mode,
        genres,
      },
      recommendations: recTracks,
    });
  } catch (err) {
    console.error('Error in /api/spotify:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}