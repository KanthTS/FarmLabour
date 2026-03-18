const exp=require('express')
const farmerApp=exp.Router()
const farmerModel=require('../Models/farmerModel')
const handler=require('express-async-handler')
const jobModel=require('../Models/jobModel')
const applicationModel=require('../Models/applicationModel')
const {requireAuth,requireRole}=require('../middleware/auth')
const { validate, Joi } = require('../middleware/validate')

const profileSchema = Joi.object({
    firstName: Joi.string().min(2).optional(),
    lastName: Joi.string().allow('').optional(),
    phoneNo: Joi.string().allow('').optional(),
    location: Joi.string().allow('').optional(),
    profileImageUrl: Joi.string().uri().allow('').optional(),
})


farmerApp.post('/job',requireAuth,requireRole('farmer'),handler(async(req,res)=>{
    const payload=req.body
    const now=new Date()
    const job=new jobModel({
        ...payload,
        jobId: payload.jobId || `${Date.now()}`,
        farmerData:{
            nameOfFarmer:req.user.firstName,
            email:req.user.email,
            profileImageUrl:req.user.profileImageUrl
        },
        reviewData:{...payload.reviewData},
        DateOfCreation: payload.DateOfCreation || now.toISOString(),
        DateOfModification: payload.DateOfModification || now.toISOString(),
        isJobActive: payload.isJobActive !== undefined ? payload.isJobActive : true
    })
    const saved=await job.save()
    res.status(201).send({message:"job details",payload:saved})
}))

farmerApp.get('/me', requireAuth, requireRole('farmer'), handler(async(req,res)=>{
    const user = await farmerModel.findById(req.user.id)
    res.send({ user })
}))

farmerApp.put('/me', requireAuth, requireRole('farmer'), validate(profileSchema), handler(async(req,res)=>{
    const updated = await farmerModel.findByIdAndUpdate(req.user.id, req.body, { new:true })
    res.send({ user: updated })
}))

farmerApp.get('/jobs',handler(async(req,res)=>{
    const {location,search}=req.query
    const query={isJobActive:true}
    if(location){
        query.location = { $regex: location, $options: 'i' }
    }
    if(search){
        query.title = { $regex: search, $options: 'i' }
    }
    let r=await jobModel.find(query).sort({DateOfCreation:-1})
    res.status(200).send({message:"jobdetails",payload:r})
}))
farmerApp.put('/job/:jobId',requireAuth,requireRole('farmer'),handler(async(req,res)=>{

    const m=req.body
    const job=await jobModel.findById(req.params.jobId)
    if(!job){
        return res.status(404).send({message:"job not found"})
    }
    if(job.farmerData?.email !== req.user.email){
        return res.status(403).send({message:"Forbidden"})
    }
    m.DateOfModification=new Date().toISOString()
    const r=await jobModel.findByIdAndUpdate(req.params.jobId,{...m},{new:true})
    res.status(200).send({message:"job details updated",payload:r})
}))
farmerApp.put('/jobs/:jobId',requireAuth,requireRole('farmer'),handler(async(req,res)=>{
    const job=await jobModel.findById(req.params.jobId)
    if(!job){
        return res.status(404).send({message:"job not found"})
    }
    if(job.farmerData?.email !== req.user.email){
        return res.status(403).send({message:"Forbidden"})
    }
    job.isJobActive=false
    job.DateOfModification=new Date().toISOString()
    const r=await job.save()
    res.status(200).send({message:"job details deleted",payload:r})
}))
farmerApp.get('/applications',handler(async(req,res)=>{
    let r=await applicationModel.find()
    res.status(200).send({message:"applications",payload:r})
}))


module.exports=farmerApp;
