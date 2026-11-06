import { Router } from 'express'
import { validateReservation } from '../middleware/validateReservation.js'
import { create } from '../controllers/reservationsController.js'

const router = Router()

router.post('/', validateReservation, create)

export default router