const exp = require('express')
const handler = require('express-async-handler')
const { requireAuth } = require('../middleware/auth')

const payApp = exp.Router()

// Mock payment intent creation (stub)
payApp.post('/payments/intent', requireAuth, handler(async(req,res)=>{
  res.send({message:'payment_intent', clientSecret:'mock_client_secret', amount:req.body.amount || 0, currency:'INR'})
}))

module.exports = payApp
