const jwt = require('jsonwebtoken')
const handler = require('express-async-handler')
const userModel = require('../Models/farmerModel')

const requireAuth = handler(async (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null

  if (!token) {
    return res.status(401).send({ message: 'Missing authorization token' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userModel.findById(decoded.id)
    if (!user || !user.isActive) {
      return res.status(401).send({ message: 'Unauthorized' })
    }
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl || '',
    }
    next()
  } catch (err) {
    return res.status(401).send({ message: 'Invalid or expired token' })
  }
})

const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return res.status(403).send({ message: 'Forbidden: insufficient role' })
  }
  next()
}

module.exports = { requireAuth, requireRole }
