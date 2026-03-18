
const mongoose=require('mongoose')
const farmerDataSchema=new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'farmerlabour'
  },
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
     workersNeeded:{
      type:Number,
      required:true,
      min:1
     },
     startDate:{
          type:Date,
          required:true
     },
     endDate:{
      type:Date,
      required:true
     },
     // High-level location label (kept for backward compatibility / search)
     location:{
       type:String,
       required:true
     },
     // Structured location pieces (optional)
     state:{
       type:String
     },
     city:{
       type:String
     },
     mandal:{
       type:String
     },
     village:{
       type:String
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
    workersNeeded:{
      type:Number,
      required:true,
      min:1
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
