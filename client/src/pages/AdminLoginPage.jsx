import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import { login } from '../services/auth.js'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/admin'

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="holiday-bg min-h-screen px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-sm">
        <header className="mb-8">
          <Logo />
        </header>
        <div className="rounded-lg bg-white shadow-xl p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-black text-center">
            Admin Login
          </h1>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-black
                  focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-red-700"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-black
                  focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-red-700"
              />
            </div>
            {error && (
              <p className="text-sm text-red-700" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-red-800 py-3 text-sm font-semibold text-white
                hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700
                disabled:bg-red-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="mt-6 text-xs text-gray-500 text-center">
            <Link to="/" className="hover:underline">
              ← Back to reservation form
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}