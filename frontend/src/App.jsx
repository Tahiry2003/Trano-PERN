import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="min-h-screen bg-[#0d0e12] text-white">

      {/* Hero Section */}
      <section
        id="center"
        className="flex min-h-[65vh] flex-col items-center justify-center gap-8 px-6 py-16 text-center"
      >
        <div className="relative flex items-center justify-center">
          <img
            src={heroImg}
            className="h-[179px] w-[170px] object-contain"
            alt=""
          />

          <img
            src={reactLogo}
            className="absolute -left-16 top-4 h-12 w-12 animate-pulse"
            alt="React logo"
          />

          <img
            src={viteLogo}
            className="absolute -right-16 bottom-4 h-12 w-12"
            alt="Vite logo"
          />
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Get started
          </h1>

          <p className="text-sm text-gray-400 sm:text-base">
            Edit{' '}
            <code className="rounded bg-white/10 px-2 py-1 text-violet-400">
              src/App.jsx
            </code>{' '}
            and save to test{' '}
            <code className="rounded bg-white/10 px-2 py-1 text-violet-400">
              HMR
            </code>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCount((count) => count + 1)}
          className="rounded-xl border border-violet-500/30 bg-violet-600 px-6 py-3 font-semibold shadow-lg shadow-violet-600/20 transition duration-300 hover:-translate-y-1 hover:bg-violet-500 active:scale-95"
        >
          Count is {count}
        </button>
      </section>

      {/* Separator */}
      <div className="mx-auto h-px max-w-5xl bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Next Steps */}
      <section
        id="next-steps"
        className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 py-16 md:grid-cols-2"
      >
        {/* Documentation */}
        <div
          id="docs"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition duration-300 hover:border-violet-500/40 hover:bg-white/[0.05]"
        >
          <svg
            className="mb-5 h-8 w-8 text-violet-400"
            role="presentation"
            aria-hidden="true"
          >
            <use href="/icons.svg#documentation-icon" />
          </svg>

          <h2 className="mb-2 text-xl font-bold">
            Documentation
          </h2>

          <p className="mb-6 text-sm text-gray-400">
            Your questions, answered
          </p>

          <ul className="space-y-3">
            <li>
              <a
                href="https://vite.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg p-3 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
              >
                <img
                  className="h-5 w-5"
                  src={viteLogo}
                  alt=""
                />
                Explore Vite
              </a>
            </li>

            <li>
              <a
                href="https://react.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg p-3 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
              >
                <img
                  className="h-5 w-5"
                  src={reactLogo}
                  alt=""
                />
                Learn more
              </a>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div
          id="social"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition duration-300 hover:border-violet-500/40 hover:bg-white/[0.05]"
        >
          <svg
            className="mb-5 h-8 w-8 text-violet-400"
            role="presentation"
            aria-hidden="true"
          >
            <use href="/icons.svg#social-icon" />
          </svg>

          <h2 className="mb-2 text-xl font-bold">
            Connect with us
          </h2>

          <p className="mb-6 text-sm text-gray-400">
            Join the Vite community
          </p>

          <ul className="space-y-3">
            <li>
              <a
                href="https://github.com/vitejs/vite"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg p-3 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
              >
                <span className="text-lg">⌘</span>
                GitHub
              </a>
            </li>

            <li>
              <a
                href="https://chat.vite.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg p-3 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
              >
                Discord
              </a>
            </li>

            <li>
              <a
                href="https://x.com/vite_js"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg p-3 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
              >
                X.com
              </a>
            </li>

            <li>
              <a
                href="https://bsky.app/profile/vite.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg p-3 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
              >
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* Footer separator */}
      <div className="h-px bg-white/10" />

      <section id="spacer" className="h-16" />

    </main>
  )
}

export default App
