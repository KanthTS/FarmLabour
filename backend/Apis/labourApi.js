const exp=require('express')
const labourApp=exp.Router()
const jobModel=require('../Models/jobModel')
const applicationModel=require('../Models/applicationModel')
const handler=require('express-async-handler')
const {requireAuth,requireRole}=require('../middleware/auth')
const { validate, Joi } = require('../middleware/validate')
const labourModel = require('../Models/farmerModel')
const { SERVICE_MANDAL, isMantralayamLocation } = require('../config/serviceRegion')
const { calcLabourProfileCompletion, getProfileCompletionBreakdown } = require('../utils/labourProfile')

const profileSchema = Joi.object({
    skills: Joi.array().items(Joi.string()).optional(),
    experienceYears: Joi.number().min(0).optional(),
    tools: Joi.array().items(Joi.string()).optional(),
    preferredWage: Joi.number().min(0).optional(),
    availability: Joi.string().allow('').optional(),
    location: Joi.string().allow('').optional(),
    profileImageUrl: Joi.string().allow('').optional(),
    phoneNo: Joi.string().allow('').optional(),
    firstName: Joi.string().min(2).optional(),
    lastName: Joi.string().allow('').optional()
})
labourApp.post('/application',requireAuth,requireRole('labour'),handler(async(req,res)=>{
    const body=req.body
    const job=await jobModel.findById(body.jobId)
    if(!job || !job.isJobActive){
        return res.status(404).send({message:"Job not found or inactive"})
    }
    const existing = await applicationModel.findOne({
      jobId: job._id,
      'labourData.email': req.user.email,
    })
    if (existing) {
      return res.status(409).send({
        message: 'You have already applied to this job.',
        payload: existing,
      })
    }
    const application=new applicationModel({
        ...body,
        jobId: job._id,
        labourData:{
            email:req.user.email,
            nameOfLabour:req.user.firstName,
            profileImageUrl:req.user.profileImageUrl
        },
        dateOfCreation: body.dateOfCreation || new Date().toISOString()
    })
    const saved=await application.save()
    res.status(201).send({message:"application details",payload:saved})
}))
labourApp.get('/jobs',handler(async(req,res)=>{
   let r=await jobModel.find({isJobActive:true})
   res.send({message:"jobs for labours",paylod:r})
}))

labourApp.get('/dashboard', requireAuth, requireRole('labour'), handler(async (req, res) => {
  const user = await labourModel.findById(req.user.id)
  const email = req.user.email
  const applications = await applicationModel
    .find({ 'labourData.email': email })
    .sort({ createdAt: -1 })

  const jobIds = [...new Set(applications.map((a) => String(a.jobId)))]
  const jobs = await jobModel.find({ _id: { $in: jobIds } })
  const jobMap = Object.fromEntries(jobs.map((j) => [String(j._id), j]))

  const hiredApps = applications.filter((a) => a.status === 'hired')
  const earnings = hiredApps.reduce((sum, app) => {
    const job = jobMap[String(app.jobId)]
    return sum + (job?.wages || 0) * 5
  }, 0)

  const latestJobs = await jobModel
    .find({
      isJobActive: true,
      $or: [{ mandal: SERVICE_MANDAL }, { location: { $regex: 'Mantralayam', $options: 'i' } }],
    })
    .sort({ DateOfCreation: -1, createdAt: -1 })
    .limit(6)

  const upcoming = hiredApps
    .map((app) => {
      const job = jobMap[String(app.jobId)]
      if (!job) return null
      return { application: app, job }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(a.job.startDate) - new Date(b.job.startDate))[0]

  const profileCompletion = calcLabourProfileCompletion(user)
  const appliedJobIds = applications.map((a) => String(a.jobId))

  res.send({
    message: 'dashboard',
    payload: {
      stats: {
        applications: applications.length,
        shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
        hired: hiredApps.length,
        earnings,
      },
      latestJobs,
      upcomingWork: upcoming || null,
      profileCompletion,
      profileBreakdown: getProfileCompletionBreakdown(user),
      appliedJobIds,
      skills: user?.skills || [],
      experienceYears: user?.experienceYears || 0,
      location: user?.location || '',
    },
  })
}))

labourApp.get('/my-jobs', requireAuth, requireRole('labour'), handler(async (req, res) => {
  const email = req.user.email
  const applications = await applicationModel
    .find({
      'labourData.email': email,
      status: { $in: ['hired', 'shortlisted'] },
    })
    .sort({ createdAt: -1 })

  const jobIds = applications.map((a) => a.jobId)
  const jobs = await jobModel.find({ _id: { $in: jobIds } })
  const jobMap = Object.fromEntries(jobs.map((j) => [String(j._id), j]))

  const payload = applications.map((app) => {
    const plain = typeof app.toObject === 'function' ? app.toObject() : { ...app }
    const job = jobMap[String(app.jobId)]
    return {
      ...plain,
      job: job
        ? typeof job.toObject === 'function'
          ? job.toObject()
          : { ...job }
        : null,
    }
  })

  res.send({ message: 'my_jobs', payload })
}))

labourApp.get('/me', requireAuth, requireRole('labour'), handler(async(req,res)=>{
    const user = await labourModel.findById(req.user.id)
    res.send({
      user,
      profileCompletion: calcLabourProfileCompletion(user),
      profileBreakdown: getProfileCompletionBreakdown(user),
    })
}))

labourApp.put('/me', requireAuth, requireRole('labour'), validate(profileSchema), handler(async(req,res)=>{
    if (req.body.location && !isMantralayamLocation(req.body.location)) {
      return res.status(400).send({
        message: 'Location must be a village under Mantralayam mandal, Andhra Pradesh.',
      })
    }
    const updated = await labourModel.findByIdAndUpdate(req.user.id, req.body, { new:true })
    res.send({
      user: updated,
      profileCompletion: calcLabourProfileCompletion(updated),
      profileBreakdown: getProfileCompletionBreakdown(updated),
    })
}))
module.exports=labourApp;
