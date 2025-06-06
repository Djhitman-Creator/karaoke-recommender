# KeyMatch Karaoke

This Next.js app recommends random songs in the same key and genre based on user input.
Built for KaraokeHouston.com and deployable on Vercel.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Add your Spotify credentials in `.env.local`:
   ```
   SPOTIFY_CLIENT_ID=<your-client-id>
   SPOTIFY_CLIENT_SECRET=<your-client-secret>
   ```

3. Run development server:
   ```
   npm run dev
   ```

4. Visit `http://localhost:3000` in your browser.

## Deploy

Push to GitHub and connect to Vercel. Ensure environment variables are set in Vercel dashboard.

