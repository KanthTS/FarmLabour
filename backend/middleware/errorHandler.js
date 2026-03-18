function notFound(req, res, next) {
  res.status(404).send({ message: 'Route not found' })
}

function errorHandler(err, req, res, next) {
  console.error(err)
  const status = res.statusCode >= 400 ? res.statusCode : 500
  res.status(status).send({ message: err.message || 'Server error' })
}

module.exports = { notFound, errorHandler }
