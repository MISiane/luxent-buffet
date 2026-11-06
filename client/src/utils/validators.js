const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PH_PHONE_REGEX = /^(\+63|0)9\d{9}$/

export const ADULT_PRICE = 1999
export const KID_PRICE = 999

export function computeTotal(adults, kids) {
  const a = Number(adults) || 0
  const k = Number(kids) || 0
  return a * ADULT_PRICE + k * KID_PRICE
}

export function validateField(field, value) {
  switch (field) {
    case 'full_name':
      if (!String(value || '').trim()) return 'Name is required.'
      if (String(value).trim().length > 120) return 'Name is too long.'
      return null
    case 'contact_number':
      if (!String(value || '').trim()) return 'Contact number is required.'
      if (!PH_PHONE_REGEX.test(String(value).trim()))
        return 'Enter a valid PH mobile number (e.g. 09171234567).'
      return null
    case 'email':
      if (!String(value || '').trim()) return 'Email is required.'
      if (!EMAIL_REGEX.test(String(value).trim()))
        return 'Enter a valid email address.'
      return null
    case 'buffet_date':
      if (!String(value || '').trim()) return 'Please select a date.'
      return null
    case 'adults':
      if (!Number.isInteger(Number(value)) || Number(value) < 1)
        return 'Adults must be at least 1.'
      return null
    case 'kids':
      if (!Number.isInteger(Number(value)) || Number(value) < 0)
        return 'Kids must be 0 or more.'
      return null
    default:
      return null
  }
}