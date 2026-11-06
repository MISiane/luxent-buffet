import { verifyAdminCredentials, signAdminToken } from '../services/authService.js'

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {}

    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      })
    }

    const admin = await verifyAdminCredentials(email.trim(), password)
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    const token = signAdminToken(admin)
    return res.json({ success: true, data: { token } })
  } catch (err) {
    next(err)
  }
}