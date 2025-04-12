const exp=require('express')
const app=exp()
app.use(exp.json())
const jobModel=require('./Models/jobModel')
const cors=require('cors')
app.use(cors())
const emailApp=require('./Apis/emailApi')
const farmerApp=require('./Apis/farmerApi')

// const multer=require('multer')

// const adminApp=require('./Apis/AdminApi')
const labourApp=require('./Apis/labourApi')
require('dotenv').config()

// const storage=multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,'uploads')
//     },
//     filename:function(req,file,cb){
//        cb(null,file.originalname)
//     }
// });
// const upload=multer({storage})
const mongoose=require('mongoose')
const port=process.env.PORT || 4000
mongoose.connect(process.env.DBURL)
.then(()=>{
    app.listen(port,()=>console.log(`connection on ${port}`))
    console.log("Database Connected Successfully")
})
.catch((err)=>{
    console.log(err)
})
app.use('/farmer-api',farmerApp)

// app.use('/admin-api',adminApp)
app.use('/labour-api',labourApp)
// app.use(exp.static('uploads'))

// app.post('/upload',upload.single('file'),async(req,res)=>{
//     const r=req.file.filename;
//     const j=new jobModel({image:r});
//     const u=await j.save()
//     res.json({message:"successfully inserted"})
    
// })
// app.get('/uploads',async(req,res)=>{
//     const r=await jobModel.find();
//     res.send({message:"gettingdetails",payload:r})
// })
app.use('/email-api',emailApp)