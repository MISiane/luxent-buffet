import { apiRequest } from './api.js'

export async function fetchBuffetDates() {
  const res = await apiRequest('/api/buffet-dates')
  return res.data
}

export async function createReservation(input) {
  const res = await apiRequest('/api/reservations', {
    method: 'POST',
    body: input,
  })
  return res.data
}