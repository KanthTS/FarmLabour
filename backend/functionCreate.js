const farmerLabourModel=require('./Models/farmerModel')
async function create(req,res){
    let user=req.body
    console.log(user)
    let r=await farmerLabourModel.findOne({email:user.email})
   
    if(r!=null){
        if(user.role===r.role){
            res.status(200).send({message:user.role,payload:r})
        }
        else{
            res.status(200).send({message:"Invalid role"})
        }
        
    }
    else{
        let u=new farmerLabourModel(user)
        let r=u.save()
        res.status(201).send({payload:r})
    }
}
module.exports=create