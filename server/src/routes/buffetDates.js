import { Router } from 'express'
import { getBuffetDates } from '../controllers/reservationsController.js'

const router = Router()

router.get('/', getBuffetDates)

export default router