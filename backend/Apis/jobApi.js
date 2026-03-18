const exp = require('express')
const handler = require('express-async-handler')
const jobModel = require('../Models/jobModel')
const applicationModel = require('../Models/applicationModel')
const { requireAuth, requireRole } = require('../middleware/auth')
const { validate, Joi } = require('../middleware/validate')

const createSchema = Joi.object({
  title: Joi.string().min(3).required(),
  content: Joi.string().min(5).required(),
  fieldSize: Joi.alternatives(Joi.string(), Joi.number()).required(),
  wages: Joi.number().min(0).required(),
  workersNeeded: Joi.number().min(1).required(),
  startDate: Joi.alternatives(Joi.date(), Joi.string()).required(),
  endDate: Joi.alternatives(Joi.date(), Joi.string()).required(),
  location: Joi.string().required(),
  state: Joi.string().optional(),
  city: Joi.string().optional(),
  mandal: Joi.string().optional(),
  village: Joi.string().optional(),
  zipcode: Joi.alternatives(Joi.number(), Joi.string()).required(),
  Timings: Joi.string().required(),
  reviewData: Joi.object().optional(),
})

const updateSchema = Joi.object({
  title: Joi.string(),
  content: Joi.string(),
  fieldSize: Joi.string(),
  wages: Joi.number().min(0),
  workersNeeded: Joi.number().min(1),
  startDate: Joi.date(),
  endDate: Joi.date(),
  location: Joi.string(),
  state: Joi.string(),
  city: Joi.string(),
  mandal: Joi.string(),
  village: Joi.string(),
  zipcode: Joi.number(),
  Timings: Joi.string(),
  isJobActive: Joi.boolean(),
})

const jobApp = exp.Router()

jobApp.post('/jobs', requireAuth, requireRole('farmer'), validate(createSchema), handler(async(req,res)=>{
  const payload = req.body
  const now = new Date()
  const job = new jobModel({
    ...payload,
    jobId: `${Date.now()}`,
    farmerData:{
      userId:req.user.id,
      nameOfFarmer:req.user.firstName,
      email:req.user.email,
      profileImageUrl:req.user.profileImageUrl
    },
    DateOfCreation: now.toISOString(),
    DateOfModification: now.toISOString(),
    isJobActive: true
  })
  const saved = await job.save()
  res.status(201).send({message:'job created', payload:saved})
}))

jobApp.get('/jobs', handler(async(req,res)=>{
  const { search, location, lat, lng, radius } = req.query
  const query = { isJobActive:true }
  if(search){
    query.title = { $regex: search, $options:'i' }
  }
  if(location){
    query.location = { $regex: location, $options:'i' }
  }
  if(lat && lng && radius){
    query.locationGeo = {
      $geoWithin:{
        $centerSphere:[[Number(lng), Number(lat)], Number(radius)/6378.1] // radius km
      }
    }
  }
  const jobs = await jobModel.find(query).sort({createdAt:-1, DateOfCreation:-1})
  res.send({message:'jobdetails', payload:jobs})
}))

jobApp.get('/jobs/:id', handler(async(req,res)=>{
  const job = await jobModel.findById(req.params.id)
  if(!job) return res.status(404).send({message:'job not found'})
  res.send({message:'job', payload:job})
}))

jobApp.patch('/jobs/:id', requireAuth, requireRole('farmer'), validate(updateSchema), handler(async(req,res)=>{
  const job = await jobModel.findById(req.params.id)
  if(!job) return res.status(404).send({message:'job not found'})
  if(job.farmerData?.email !== req.user.email) return res.status(403).send({message:'Forbidden'})
  job.set({...req.body, DateOfModification:new Date().toISOString()})
  const saved = await job.save()
  res.send({message:'job updated', payload:saved})
}))

jobApp.patch('/jobs/:id/close', requireAuth, requireRole('farmer'), handler(async(req,res)=>{
  const job = await jobModel.findById(req.params.id)
  if(!job) return res.status(404).send({message:'job not found'})
  if(job.farmerData?.email !== req.user.email) return res.status(403).send({message:'Forbidden'})
  job.isJobActive=false
  job.DateOfModification=new Date().toISOString()
  const saved=await job.save()
  res.send({message:'job closed', payload:saved})
}))

// Applications
jobApp.post('/jobs/:id/applications', requireAuth, requireRole('labour'), handler(async(req,res)=>{
  const job = await jobModel.findById(req.params.id)
  if(!job || !job.isJobActive) return res.status(404).send({message:'Job not found or inactive'})
  const body=req.body
  const application=new applicationModel({
    ...body,
    jobId: job._id,
    applicationId: body.applicationId || `${Date.now()}`,
    labourData:{ userId:req.user.id, email:req.user.email, nameOfLabour:req.user.firstName, profileImageUrl:req.user.profileImageUrl },
    dateOfCreation:new Date()
  })
  const saved=await application.save()
  res.status(201).send({message:'application created', payload:saved})
}))

jobApp.get('/jobs/:id/applications', requireAuth, requireRole('farmer'), handler(async(req,res)=>{
  const job = await jobModel.findById(req.params.id)
  if(!job) return res.status(404).send({message:'job not found'})
  if(job.farmerData?.email !== req.user.email) return res.status(403).send({message:'Forbidden'})
  const apps = await applicationModel.find({jobId:req.params.id}).sort({createdAt:-1})
  res.send({message:'applications', payload:apps})
}))

jobApp.patch('/applications/:id', requireAuth, requireRole('farmer'), handler(async(req,res)=>{
  const appDoc = await applicationModel.findById(req.params.id)
  if(!appDoc) return res.status(404).send({message:'application not found'})
  const job = await jobModel.findById(appDoc.jobId)
  if(job.farmerData?.email !== req.user.email) return res.status(403).send({message:'Forbidden'})
  const nextStatus = req.body.status
  const allowed = ['shortlisted','hired','rejected']
  if(!allowed.includes(nextStatus)) return res.status(400).send({message:'invalid status'})
  appDoc.status = nextStatus
  appDoc.statusHistory.push({status:nextStatus})
  const saved = await appDoc.save()
  res.send({message:'application updated', payload:saved})
}))

// Current user's applications (farmer: only their jobs; labourer: own)
jobApp.get('/applications/mine', requireAuth, handler(async(req,res)=>{
  if(req.user.role === 'labour'){
    const apps = await applicationModel.find({'labourData.email': req.user.email}).sort({createdAt:-1})
    return res.send({message:'applications', payload:apps})
  }
  if(req.user.role === 'farmer'){
    const jobIds = await jobModel.find({'farmerData.email': req.user.email}).distinct('_id')
    const apps = await applicationModel.find({jobId: {$in: jobIds}}).sort({createdAt:-1})
    return res.send({message:'applications', payload:apps})
  }
  return res.status(403).send({message:'Forbidden'})
}))

module.exports = jobApp
