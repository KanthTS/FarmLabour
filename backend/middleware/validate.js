const Joi = require('joi')

function validate(schema) {
  return (req, res, next) => {
    const payload = ['get', 'delete'].includes(req.method.toLowerCase()) ? req.query : req.body
    const { error, value } = schema.validate(payload, { abortEarly: false, stripUnknown: true })
    if (error) {
      const details = error.details.map((d) => d.message)
      return res.status(422).send({ message: 'Validation error', details })
    }
    if (req.method.toLowerCase() === 'get') req.query = value
    else req.body = value
    next()
  }
}

module.exports = { validate, Joi }
