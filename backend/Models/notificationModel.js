const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  userId:{ type: mongoose.Schema.Types.ObjectId, ref:'farmerlabour', required:true },
  type:{ type:String, required:true },
  payload:{ type:Object, default:{} },
  read:{ type:Boolean, default:false },
},{timestamps:true})

module.exports = mongoose.model('notification', notificationSchema)
