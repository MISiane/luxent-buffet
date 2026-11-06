import { useState } from 'react'
import { computeTotal, validateField } from '../utils/validators.js'
import { createReservation } from '../services/reservations.js'

const INITIAL = {
  full_name: '',
  contact_number: '',
  email: '',
  buffet_date: '',
  adults: 1,
  kids: 0,
}

export function useReservationForm() {
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(null)
  const [submitError, setSubmitError] = useState(null)

  const total = computeTotal(values.adults, values.kids)

  function setField(field, value) {
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) {
      setErrors((e) => ({ ...e, [field]: validateField(field, value) }))
    }
  }

  function validateAll() {
    const next = {}
    for (const field of Object.keys(INITIAL)) {
      const msg = validateField(field, values[field])
      if (msg) next[field] = msg
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function submit() {
    setSubmitError(null)
    if (!validateAll()) return

    setSubmitting(true)
    try {
      const payload = {
        ...values,
        adults: Number(values.adults),
        kids: Number(values.kids),
      }
      const result = await createReservation(payload)
      setSubmitted(result)
    } catch (err) {
      if (err.field) {
        setErrors((e) => ({ ...e, [err.field]: err.message }))
      } else {
        setSubmitError(err.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setValues(INITIAL)
    setErrors({})
    setSubmitted(null)
    setSubmitError(null)
  }

  return {
    values,
    errors,
    total,
    submitting,
    submitted,
    submitError,
    setField,
    submit,
    reset,
  }
}