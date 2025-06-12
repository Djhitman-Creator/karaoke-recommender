import { useState, useEffect } from 'react';

// Default list of karaoke themes. Feel free to extend or customize.
const defaultThemes = [
  '80s Hits',
  'Disney Classics',
  'Movie Soundtracks',
  'One-Hit Wonders',
  'MTV Unplugged',
  'Boy Bands vs. Girl Groups',
  'Rock Anthems',
  'Pop Divas',
  'Country Night',
  'Duets',
  'Broadway Hits',
  'K-Pop'
];

export default function ThemePicker() {
  // Path to your logo. Place your logo file (e.g., logo.png) in the public/ folder.
  const logoSrc = '/logo.png';

  const [themes, setThemes] = useState(defaultThemes);
  const [available, setAvailable] = useState([]);
  const [used, setUsed] = useState([]);
  const [theme, setTheme] = useState('');
  const [newTheme, setNewTheme] = useState('');

  // Load stored data on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
    const storedThemes = JSON.parse(localStorage.getItem('karaokeThemes') || 'null');
    const storedAvailable = JSON.parse(localStorage.getItem('karaokeAvailable') || 'null');
    const storedUsed = JSON.parse(localStorage.getItem('karaokeUsed') || 'null');
    if (storedThemes && Array.isArray(storedThemes)) {
      setThemes(storedThemes);
    }
    if (storedAvailable && Array.isArray(storedAvailable)) {
      setAvailable(storedAvailable);
    } else {
      setAvailable(Array.isArray(storedThemes) && storedThemes.length ? storedThemes : defaultThemes);
    }
    if (storedUsed && Array.isArray(storedUsed)) {
      setUsed(storedUsed);
    }
  }, []);

  // Persist themes list
  useEffect(() => {
    localStorage.setItem('karaokeThemes', JSON.stringify(themes));
  }, [themes]);

  // Persist available pool
  useEffect(() => {
    localStorage.setItem('karaokeAvailable', JSON.stringify(available));
  }, [available]);

  // Persist used history
  useEffect(() => {
    localStorage.setItem('karaokeUsed', JSON.stringify(used));
  }, [used]);

  const pickRandom = () => {
    // Reset cycle if we've used all themes
    const pool = available.length ? available : [...themes];
    const history = available.length ? used : [];
    const idx = Math.floor(Math.random() * pool.length);
    const picked = pool[idx];

    // Update pools
    setTheme(picked);
    setAvailable(pool.filter((_, i) => i !== idx));
    setUsed([...history, picked]);
  };

  const addTheme = () => {
    const trimmed = newTheme.trim();
    if (!trimmed || themes.includes(trimmed)) {
      setNewTheme('');
      return;
    }
    setThemes(prev => [...prev, trimmed]);
    setAvailable(prev => [...prev, trimmed]);
    setNewTheme('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 max-w-md w-full text-center">
        {/* Logo */}
        {logoSrc && <img src={logoSrc} alt="Logo" className="h-16 mx-auto mb-4" />}
        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          Random Karaoke Theme Picker
        </h1>
        <p className="text-md font-medium mb-4 text-gray-800 dark:text-gray-200">
          Select a Karaoke Theme!
        </p>
        <p className="text-lg mb-2 text-gray-700 dark:text-gray-300">
          {theme || 'Ready for your next karaoke theme?'}
        </p>
        <p className="text-sm mb-4 text-gray-500 dark:text-gray-400">
          {available.length} theme{available.length !== 1 && 's'} left before reset
        </p>
        <button
          onClick={pickRandom}
          className="mb-6 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow"
        >
          Pick a Theme
        </button>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newTheme}
            onChange={(e) => setNewTheme(e.target.value)}
            placeholder="Add a new theme"
            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
          <button
            onClick={addTheme}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
          >
            Add
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-4 max-w-md w-full">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Your Themes</h2>
        <ul className="list-disc list-inside text-left text-gray-700 dark:text-gray-300">
          {themes.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
