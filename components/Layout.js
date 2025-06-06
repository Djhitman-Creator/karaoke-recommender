import { useState } from 'react';

export default function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            <h1 className="text-xl font-semibold">KeyMatch Karaoke</h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
          >
            {darkMode ? '🌞 Light' : '🌚 Dark'}
          </button>
        </header>

        <main className="p-4 max-w-xl mx-auto">{children}</main>

        <footer className="mt-8 p-4 text-center text-sm">
          <p className="mb-1">
            Need a new song suggestion? Enter a song you are comfortable singing
            to find other songs that should be in your key and vocal range!
          </p>
          <a
            href="https://karaokehouston.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            karaokehouston.com
          </a>
        </footer>
      </div>
    </div>
  );
}