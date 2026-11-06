const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PH_PHONE_REGEX = /^(\+63|0)9\d{9}$/

export function validateReservationInput(body) {
  const errors = []

  const full_name = typeof body.full_name === 'string' ? body.full_name.trim() : ''
  if (!full_name) {
    errors.push({ field: 'full_name', message: 'Name is required.' })
  } else if (full_name.length > 120) {
    errors.push({ field: 'full_name', message: 'Name is too long.' })
  }

  const contact_number =
    typeof body.contact_number === 'string' ? body.contact_number.trim() : ''
  if (!contact_number) {
    errors.push({ field: 'contact_number', message: 'Contact number is required.' })
  } else if (!PH_PHONE_REGEX.test(contact_number)) {
    errors.push({
      field: 'contact_number',
      message: 'Enter a valid PH mobile number (e.g. 09171234567 or +639171234567).',
    })
  }

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  if (!email) {
    errors.push({ field: 'email', message: 'Email is required.' })
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push({ field: 'email', message: 'Enter a valid email address.' })
  }

  const buffet_date =
    typeof body.buffet_date === 'string' ? body.buffet_date.trim() : ''
  if (!buffet_date) {
    errors.push({ field: 'buffet_date', message: 'Please select a date.' })
  }

  const adults = Number(body.adults)
  if (!Number.isInteger(adults) || adults < 1) {
    errors.push({ field: 'adults', message: 'Adults must be at least 1.' })
  }

  const kids = Number(body.kids)
  if (!Number.isInteger(kids) || kids < 0) {
    errors.push({ field: 'kids', message: 'Kids must be 0 or more.' })
  }

  if (errors.length > 0) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    value: { full_name, contact_number, email, buffet_date, adults, kids },
  }
}