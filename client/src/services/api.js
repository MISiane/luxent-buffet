const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const TOKEN_KEY = 'luxent_admin_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export async function apiRequest(
  path,
  { method = 'GET', body, headers, auth = false } = {}
) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(auth && getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  let payload = null
  try {
    payload = await res.json()
  } catch {
    // non-JSON (e.g. CSV — callers shouldn't use this helper for CSV)
  }

  if (res.status === 401 && auth) {
    clearToken()
    // Signal the router layer to redirect
    window.dispatchEvent(new Event('auth:logout'))
  }

  if (!res.ok) {
    const err = new Error(payload?.message || `Request failed (${res.status})`)
    err.status = res.status
    err.field = payload?.field
    err.payload = payload
    throw err
  }

  return payload
}