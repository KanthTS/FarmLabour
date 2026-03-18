const exp = require('express')
const handler = require('express-async-handler')
const { requireAuth } = require('../middleware/auth')
const messageModel = require('../Models/messageModel')
const jobModel = require('../Models/jobModel')

const msgApp = exp.Router()

// get messages for a job if participant
msgApp.get('/jobs/:id/messages', requireAuth, handler(async(req,res)=>{
  const job = await jobModel.findById(req.params.id)
  if(!job) return res.status(404).send({message:'job not found'})
  const isParticipant = job.farmerData?.email === req.user.email
  const apps = await messageModel.find({jobId:req.params.id}).sort({createdAt:1})
  const filtered = isParticipant ? apps : apps.filter(m=>String(m.from)===String(req.user.id) || String(m.to)===String(req.user.id))
  res.send({message:'messages', payload:filtered})
}))

// post message
msgApp.post('/jobs/:id/messages', requireAuth, handler(async(req,res)=>{
  const job = await jobModel.findById(req.params.id)
  if(!job) return res.status(404).send({message:'job not found'})
  const { to, body } = req.body
  if(!to || !body) return res.status(400).send({message:'to and body required'})
  const msg = await messageModel.create({ jobId:req.params.id, from:req.user.id, to, body })
  res.status(201).send({message:'sent', payload:msg})
}))

module.exports = msgApp
