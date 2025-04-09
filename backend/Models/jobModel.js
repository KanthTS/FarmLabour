
const mongoose=require('mongoose')
const farmerDataSchema=new mongoose.Schema({
  nameOfFarmer:{
    type:String,
        required:true
  },
  profileImageUrl:{
    type:String,
        
  },
  email:{
    type:String,
        required:true
  }
},{"strict":"throw"})

const reviewsSchema=new mongoose.Schema({
   nameOfFarmer:{
      type:String,
        required:true
   },
   rating:{
      type:Number,
      min:1,
      max:5
   },
   comment:{
      type:String,
      
   },
   profileImageUrl:{
      type:String
        
   }
},{"strict":"throw"})

const jobSchema=new mongoose.Schema({
     jobId:{
        type:String,
        required:true
     },
      farmerData:{
        type:farmerDataSchema
      },
      
     title:{
      type:String,
        required:true,
        unique:true
     },
    //  image:{
    //    type:String,
    //    required:true
    //  },
     content:{
      type:String,
        required:true
     },
     fieldSize:{
      type:String,
        required:true
     },
     wages:{
      type:Number,
      required:true
     },
     startDate:{
          type:Date,
          required:true
     },
     endDate:{
      type:Date,
      required:true
     },
     location:{
       type:String,
       required:true
     },
    
    zipcode:{
      type:Number,
      required:true,
      
    },
     DateOfCreation:{
       type:String,
       required:true
     },
     DateOfModification:{
      type:String,
      required:true
    },
 
    Timings:{
       type:String,
       required:true
    },
    reviewData:{
      type:reviewsSchema
    },
    isJobActive:{
      type:Boolean,
        default:true,
       
    }
},{"strict":"throw"})

const jobData=mongoose.model('jobs',jobSchema)
module.exports=jobData;