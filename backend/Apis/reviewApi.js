const exp = require('express')
const handler = require('express-async-handler')
const { requireAuth } = require('../middleware/auth')
const reviewModel = require('../Models/reviewModel')

const reviewApp = exp.Router()

reviewApp.post('/reviews', requireAuth, handler(async(req,res)=>{
  const { jobId, revieweeId, revieweeRole, rating, comment } = req.body
  if(!jobId || !revieweeId || !revieweeRole || !rating) return res.status(400).send({message:'missing fields'})
  const doc = await reviewModel.create({
    jobId, reviewerId:req.user.id, revieweeId, roleOfReviewee:revieweeRole, rating, comment
  })
  res.status(201).send({message:'reviewed', payload:doc})
}))

reviewApp.get('/reviews', handler(async(req,res)=>{
  const { userId } = req.query
  const q = userId ? { revieweeId:userId } : {}
  const docs = await reviewModel.find(q).sort({createdAt:-1})
  res.send({message:'reviews', payload:docs})
}))

module.exports = reviewApp
