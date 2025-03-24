const exp=require('express')
const labourApp=exp.Router()
const labourModel=require('../Models/farmerModel')
const jobModel=require('../Models/jobModel')
const applicationModel=require('../Models/applicationModel')
const handler=require('express-async-handler')
const create=require('../functionCreate')
labourApp.post('/labour',handler(create))
labourApp.post('/application',handler(async(req,res)=>{
    let b=req.body
    const newLabour=new applicationModel(b)
    let r=await newLabour.save()
    res.status(201).send({message:"application details",payload:r})
}))
labourApp.get('/jobs',handler(async(req,res)=>{
   let r=await jobModel.find()
   res.send({message:"jobs for labours",paylod:r})
}))
module.exports=labourApp;