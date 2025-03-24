const {mongoose} = require("mongoose");

const farmerLabourSchema=new mongoose.Schema({
    role:{
        type:String,
    required:true,
    
    },
  email:{
    type:String,
    required:true,
    unique:true
  },
  firstName:{
    type:String,
    required:true
  },
  lastName:{
    type:String,
    
  },
  // phoneNo:{
  //   type:String,
  //   required:true,default:"unknown"
  // },
  // location:{
  //   type:String,
  //   required:true,default:"unknown"
  // },
  
  profileImageUrl:{
    type:String,
    required:true
  },
  isActive:{
    default:true,
   type:Boolean
  }

},{'strict':'throw'})
const farmerLabourModel=mongoose.model('farmerlabour',farmerLabourSchema)
module.exports=farmerLabourModel;