const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  jobId:{ type: mongoose.Schema.Types.ObjectId, ref:'jobs', required:true },
  reviewerId:{ type: mongoose.Schema.Types.ObjectId, ref:'farmerlabour', required:true },
  revieweeId:{ type: mongoose.Schema.Types.ObjectId, ref:'farmerlabour', required:true },
  roleOfReviewee:{ type:String, enum:['labour','farmer'], required:true },
  rating:{ type:Number, min:1, max:5, required:true },
  comment:{ type:String, default:'' },
},{timestamps:true})

module.exports = mongoose.model('review', reviewSchema)
