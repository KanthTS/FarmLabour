const exp=require('express')
const farmerApp=exp.Router()
const farmerModel=require('../Models/farmerModel')
const handler=require('express-async-handler')
const jobModel=require('../Models/jobModel')
const create=require('../functionCreate')
const applicationModel=require('../Models/applicationModel')


farmerApp.post('/farmer',handler(create))


farmerApp.post('/job',handler(async(req,res)=>{
    let j=req.body
    const newUser=new jobModel(j)
    let r=await newUser.save()
    res.status(201).send({message:"job details",payload:r})
}))

farmerApp.get('/jobs',handler(async(req,res)=>{
    let m=req.body
    let r=await jobModel.find({isJobActive:true})
    res.status(200).send({message:"jobdetails",payload:r})
}))
farmerApp.put('/job/:jobId',handler(async(req,res)=>{
    let m=req.body
    let r=await jobModel.findByIdAndUpdate(m._id,{...m},{returnOriginal:false})
    res.status(200).send({message:"job details updated",payload:r})
}))
farmerApp.put('/jobs/:jobId',handler(async(req,res)=>{
    let m=req.body
    let r=await jobModel.findByIdAndUpdate(m._id,{...m},{returnOriginal:false})
    res.status(200).send({message:"job details deleted",payload:r})
}))
farmerApp.get('/applications',handler(async(req,res)=>{
    let r=await applicationModel.find()
    res.status(200).send({message:"applications",payload:r})
}))


module.exports=farmerApp;