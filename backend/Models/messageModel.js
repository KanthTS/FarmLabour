const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  jobId:{ type: mongoose.Schema.Types.ObjectId, ref:'jobs', required:true },
  from:{ type: mongoose.Schema.Types.ObjectId, ref:'farmerlabour', required:true },
  to:{ type: mongoose.Schema.Types.ObjectId, ref:'farmerlabour', required:true },
  body:{ type:String, required:true },
  createdAt:{ type:Date, default:Date.now }
},{timestamps:true})

module.exports = mongoose.model('message', messageSchema)
