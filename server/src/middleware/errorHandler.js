export function notFound(req, res) {
  res.status(404).json({ success: false, message: 'Not found' })
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(err)
  const status = err.status || 500
  const message = err.message || 'Internal server error'
  res.status(status).json({ success: false, message })
}