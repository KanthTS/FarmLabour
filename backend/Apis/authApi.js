const exp = require('express')
const handler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('../Models/farmerModel')
const { requireAuth } = require('../middleware/auth')
const { validate, Joi } = require('../middleware/validate')

function buildToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

function safeUser(user) {
  return {
    id: user._id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImageUrl: user.profileImageUrl,
    location: user.location,
    phoneNo: user.phoneNo,
  }
}

const authApp = exp.Router()

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('farmer', 'labour').required(),
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().allow(''),
  profileImageUrl: Joi.string().uri().allow(''),
  phoneNo: Joi.string().allow(''),
  location: Joi.string().allow(''),
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

authApp.post(
  '/register',
  validate(registerSchema),
  handler(async (req, res) => {
    const { email, password, role, firstName, lastName, profileImageUrl, phoneNo, location } = req.body
    const existing = await userModel.findOne({ email })
    if (existing) {
      return res.status(409).send({ message: 'User already exists' })
    }
    const hashed = await bcrypt.hash(password, 10)
    const user = await userModel.create({
      email,
      password: hashed,
      role,
      firstName,
      lastName: lastName || '',
      profileImageUrl: profileImageUrl || '',
      phoneNo: phoneNo || '',
      location: location || '',
    })
    const token = buildToken(user)
    res.status(201).send({ message: 'registered', token, user: safeUser(user) })
  })
)

authApp.post(
  '/login',
  validate(loginSchema),
  handler(async (req, res) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(401).send({ message: 'Invalid credentials' })
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).send({ message: 'Invalid credentials' })
    }
    const token = buildToken(user)
    res.send({ message: 'authenticated', token, user: safeUser(user) })
  })
)

authApp.get(
  '/me',
  requireAuth,
  handler(async (req, res) => {
    const user = await userModel.findById(req.user.id)
    res.send({ message: 'me', user: safeUser(user) })
  })
)

module.exports = authApp
