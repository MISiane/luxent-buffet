import { validateReservationInput } from '../utils/validators.js'

export function validateReservation(req, res, next) {
  const result = validateReservationInput(req.body || {})
  if (!result.ok) {
    const first = result.errors[0]
    return res.status(400).json({
      success: false,
      message: first.message,
      field: first.field,
      errors: result.errors,
    })
  }
  req.validated = result.value
  next()
}