import { useEffect, useState } from 'react'
import { fetchBuffetDates } from '../services/reservations.js'

export function useBuffetDates() {
  const [dates, setDates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchBuffetDates()
      .then((data) => {
        if (!cancelled) setDates(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { dates, loading, error }
}