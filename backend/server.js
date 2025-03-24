const exp=require('express')
const app=exp()
app.use(exp.json())
const cors=require('cors')
app.use(cors())

const farmerApp=require('./Apis/farmerApi')
// const adminApp=require('./Apis/AdminApi')
const labourApp=require('./Apis/labourApi')
require('dotenv').config()

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

