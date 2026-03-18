const mongoose = require("mongoose");
const labourDataSchema=new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'farmerlabour'
    },
    nameOfLabour:{
        type:String,
        required:true
    },
    profileImageUrl:{
        type:String
    },
    email:{
        type:String,
        required:true
    }
},{"strict":"throw"})
const statusHistorySchema=new mongoose.Schema({
    status:{type:String, required:true},
    at:{type:Date, default:Date.now}
},{_id:false})

const applicationSchema=new mongoose.Schema({
    applicationId:{ type:String, required:true },
    fullname:{ type:String, required:true },
    jobId:{ type: mongoose.Schema.Types.ObjectId, ref:'jobs', required:true },
    experience:{ type:String, required:true },
    workinghours:{ type:String, required:true },
    skills:{ type:String, required:true },
    status:{ type:String, enum:['applied','shortlisted','hired','rejected','withdrawn'], default:'applied' },
    statusHistory:{ type:[statusHistorySchema], default:[{status:'applied'}] },
    dateOfCreation:{ type:Date, default:Date.now },
    labourData:{ type:labourDataSchema },
    location:{ type:String, required:true },
},{"strict":"throw",timestamps:true})

const applicationData=mongoose.model('application',applicationSchema)
module.exports=applicationData;
