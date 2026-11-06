import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import reservationsRouter from './routes/reservations.js'
import buffetDatesRouter from './routes/buffetDates.js'
import authRouter from './routes/auth.js'
import adminRouter from './routes/admin.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' } })
})

app.use('/api/buffet-dates', buffetDatesRouter)
app.use('/api/reservations', reservationsRouter)
app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})