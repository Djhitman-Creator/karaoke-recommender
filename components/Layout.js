import { useState, useEffect } from 'react'

export default function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <header className="flex justify-between items-center p-4 shadow-md bg-gray-100 dark:bg-gray-800">
        <div className="flex items-center">
          {/* Placeholder logo - add your logo in public/logo.png */}
          <img src="/logo.png" alt="Logo" className="h-10 w-10 mr-2" />
          <h1 className="text-xl font-bold">KeyMatch Karaoke</h1>
        </div>
        <button
          className="px-2 py-1 border rounded dark:border-gray-400"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '🌞 Light' : '🌚 Dark'}
        </button>
      </header>
      <main className="p-4">
        {children}
      </main>
      <footer className="p-4 text-center">
        <p>Need a new song suggestion? Enter a song you are comfortable singing to find other songs that should be in your key and vocal range!</p>
        <p className="mt-2">
          Visit: <a href="https://karaokehouston.com" target="_blank" rel="noopener noreferrer" className="text-blue-500">karaokehouston.com</a>
        </p>
      </footer>
    </div>
  )
}
