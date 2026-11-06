import {
  createReservation,
  isActiveBuffetDate,
  listActiveBuffetDates,
} from '../services/reservationsService.js'

export async function create(req, res, next) {
  try {
    const input = req.validated

    const active = await isActiveBuffetDate(input.buffet_date)
    if (!active) {
      return res.status(400).json({
        success: false,
        message: 'Selected date is not available.',
        field: 'buffet_date',
      })
    }

    const reservation = await createReservation(input)
    return res.status(201).json({ success: true, data: reservation })
  } catch (err) {
    next(err)
  }
}

export async function getBuffetDates(req, res, next) {
  try {
    const dates = await listActiveBuffetDates()
    return res.json({ success: true, data: dates })
  } catch (err) {
    next(err)
  }
}