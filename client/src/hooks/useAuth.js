import { useEffect, useState } from 'react'
import { isAuthenticated, logout as doLogout } from '../services/auth.js'

export function useAuth() {
  const [authed, setAuthed] = useState(isAuthenticated())

  useEffect(() => {
    const handler = () => setAuthed(false)
    window.addEventListener('auth:logout', handler)
    return () => window.removeEventListener('auth:logout', handler)
  }, [])

  function logout() {
    doLogout()
    setAuthed(false)
  }

  return { authed, logout }
}