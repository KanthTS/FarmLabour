const mongoose=require('mongoose')
const emailSchema=new mongoose.Schema({
    to:String,
    subject:String,
    message:String
},{'strict':'throw'})

const emailModel=mongoose.model('emails',emailSchema)

module.exports=emailModel;