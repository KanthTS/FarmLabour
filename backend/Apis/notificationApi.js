const exp = require('express')
const handler = require('express-async-handler')
const { requireAuth } = require('../middleware/auth')
const notificationModel = require('../Models/notificationModel')

const notifApp = exp.Router()

notifApp.get('/notifications', requireAuth, handler(async(req,res)=>{
  const list = await notificationModel.find({userId:req.user.id}).sort({createdAt:-1}).limit(50)
  res.send({message:'notifications', payload:list})
}))

notifApp.patch('/notifications/:id/read', requireAuth, handler(async(req,res)=>{
  const n = await notificationModel.findOneAndUpdate({_id:req.params.id, userId:req.user.id},{read:true},{new:true})
  if(!n) return res.status(404).send({message:'not found'})
  res.send({message:'read', payload:n})
}))

module.exports = notifApp
