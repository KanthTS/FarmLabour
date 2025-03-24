import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { createObj } from '../contexts/FarmerLabourContext';


function Applications() {
   const {currentUser,setCurrentUser}=useContext(createObj)
  const [app,setApp]=useState([])
  const [input,setInput]=useState('')
  const [err,setErr]=useState('');
  const [load,setLoad]=useState(false)
   const [data,setData]=useState([])
   async function getApp(){
     setLoad(true)
    let res= await axios.get('http://localhost:3000/farmer-api/applications')
    try{
      if(res.data.message==='applications'){
        setApp(res.data.payload)
        setData(res.data.payload)
      }
      else{
        setErr(res.data.message)
      }
    }
    catch(error){
      setErr('no jobs')
    }finally{
      setLoad(false)
    }
   }
   function live(e){
    const val=e.target.value;
      setInput(val)
      
      const d=app.filter((item)=>{
        return item.skills.toLowerCase().includes(val.toLowerCase())
      
      });
      setData(d);

   }
   function handle(){
    const d=app.filter((items)=>{
      return items.skills.toLowerCase().includes(input.toLowerCase())
    });
    setData(d);
   }
   useEffect(()=>{
    getApp()
   },[])

   console.log('app',app)
  return (
    <div>
     <div>
     <input type="text" placeholder="search by skills..." value={input} onChange={live}/>
      <button  onClick={handle} className="btn btn-success" >search</button>
      {data.length===0 && !load && !err && (
      <p className="text-danger">No results found</p>
      )}
     </div>
      {
       data.map((id)=>(
       <div key={id.applicationId}>
        <div className="card ">
         <div className="d-flex justify-content-between card-header">
         <p className="lead">{id.fullname}</p>
         <img src={id.labourData.profileImageUrl} width="40px"/>
          </div>
          <div className="card-body ">

           <p className="lead">Skills:[{id.skills}]</p>
           <p className="lead">Working Hours:{id.workinghours}</p>
           <p className="lead"> Location:{id.location}</p>
            </div>
            <div className="card-footer d-flex justify-content-between">
              <p >created on..{id.dateOfCreation}</p>
              {
                currentUser.role==='farmer'?
              <>
              <button className="btn btn-success">Approve</button>
              </>:
              <>
              
              </>
              } 
              </div>
          </div>
       </div>


       ))
      }
    </div>
  )
}

export default Applications