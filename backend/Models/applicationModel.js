const {  mongoose } = require("mongoose");
const labourDataSchema=new mongoose.Schema({
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
const applicationSchema=new mongoose.Schema({
    applicationId:{
        type:String,
        required:true
    },
 fullname:{
    type:String,
    required:true
 },
jobId:{

    type: mongoose.Schema.Types.ObjectId,
    ref:'jobs',
    required:true
},
// status:{
//     type:String,
//     required:true,
// },
experience:{
    type:String,
    required:true
},
workinghours:{
    type:String,
    required:true
},
skills:{
    type:String,
    required:true,
},

dateOfCreation:{
    type:String,
    required:true
  },
  labourData:{
   type:labourDataSchema
  },
  location:{
    type:String,
    required:true
  }
},{"strict":"throw"})

const applicationData=mongoose.model('application',applicationSchema)
module.exports=applicationData;