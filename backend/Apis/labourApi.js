const exp=require('express')
const labourApp=exp.Router()
const jobModel=require('../Models/jobModel')
const applicationModel=require('../Models/applicationModel')
const handler=require('express-async-handler')
const {requireAuth,requireRole}=require('../middleware/auth')
const { validate, Joi } = require('../middleware/validate')
const labourModel = require('../Models/farmerModel')

const profileSchema = Joi.object({
    skills: Joi.array().items(Joi.string()).optional(),
    experienceYears: Joi.number().min(0).optional(),
    tools: Joi.array().items(Joi.string()).optional(),
    preferredWage: Joi.number().min(0).optional(),
    availability: Joi.string().allow('').optional(),
    location: Joi.string().allow('').optional(),
    profileImageUrl: Joi.string().uri().allow('').optional(),
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

labourApp.get('/me', requireAuth, requireRole('labour'), handler(async(req,res)=>{
    const user = await labourModel.findById(req.user.id)
    res.send({ user })
}))

labourApp.put('/me', requireAuth, requireRole('labour'), validate(profileSchema), handler(async(req,res)=>{
    const updated = await labourModel.findByIdAndUpdate(req.user.id, req.body, { new:true })
    res.send({ user: updated })
}))
module.exports=labourApp;
