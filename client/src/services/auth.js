import { apiRequest, setToken, clearToken, getToken } from './api.js'

export async function login(email, password) {
  const res = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  })
  setToken(res.data.token)
  return res.data
}

export function logout() {
  clearToken()
}

export function isAuthenticated() {
  return !!getToken()
}