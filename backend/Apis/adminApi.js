const exp = require('express')
const handler = require('express-async-handler')
const { requireAuth, requireRole } = require('../middleware/auth')
const userModel = require('../Models/farmerModel')
const jobModel = require('../Models/jobModel')
const applicationModel = require('../Models/applicationModel')

const adminApp = exp.Router()

// Users list
adminApp.get('/users', requireAuth, requireRole('admin'), handler(async(req,res)=>{
  const users = await userModel.find().select('-password')
  res.send({message:'users', payload:users})
}))

// Suspend/activate user
adminApp.patch('/users/:id/status', requireAuth, requireRole('admin'), handler(async(req,res)=>{
  const { isActive } = req.body
  const user = await userModel.findByIdAndUpdate(req.params.id,{ isActive },{new:true})
  if(!user) return res.status(404).send({message:'user not found'})
  res.send({message:'user updated', payload:user})
}))

// Remove job
adminApp.delete('/jobs/:id', requireAuth, requireRole('admin'), handler(async(req,res)=>{
  const job = await jobModel.findByIdAndDelete(req.params.id)
  if(!job) return res.status(404).send({message:'job not found'})
  // delete related applications
  await applicationModel.deleteMany({jobId:req.params.id})
  res.send({message:'job removed'})
}))

// Analytics summary (simple)
adminApp.get('/analytics/summary', requireAuth, requireRole('admin'), handler(async(req,res)=>{
  const [users, jobs, apps] = await Promise.all([
    userModel.countDocuments(),
    jobModel.countDocuments(),
    applicationModel.countDocuments()
  ])
  res.send({message:'summary', payload:{users,jobs,applications:apps}})
}))

module.exports = adminApp
