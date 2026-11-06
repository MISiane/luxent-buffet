import { Router } from 'express'
import { requireAdmin } from '../middleware/auth.js'
import {
  getReservations,
  exportReservationsCsv,
  patchReservationStatus,
} from '../controllers/adminController.js'

const router = Router()

router.use(requireAdmin)

router.get('/reservations', getReservations)
router.get('/reservations/export', exportReservationsCsv)
router.patch('/reservations/:id/status', patchReservationStatus)

export default router