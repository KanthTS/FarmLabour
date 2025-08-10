
const exp=require('express')
const contactApp=exp.Router()
const contactModel=require('../Models/ContactModel')
contactApp.post('/contact',async(req,res)=>{
    let r=req.body;
    let c=new contactModel(r);
    let j=await c.save();
    res.status(201).send({message:"contact",payload:j})
})

module.exports=contactApp;