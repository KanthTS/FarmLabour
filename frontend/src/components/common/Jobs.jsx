import React,{useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

function Jobs() {
    const nav=useNavigate()
    const [jobs,setJobs]=useState([])
    const [err,setErr]=useState('')
    const [load,setLoad]=useState(false)
    const [searchInputValue,setSearchInputValue]=useState('')
     const [data,setData]=useState([])
   async function getJobs(){
    setLoad(true)
      try{
        let res=await axios.get('http://localhost:3000/farmer-api/jobs')
      console.log(res.data)
      if(res.data.message==='jobdetails'){
        setJobs(res.data.payload)
        setData(res.data.payload)
      }else{
        setErr(res.data.message)
        
      }
      }
      catch(error){
        setErr('fecthing no jobs')
      }
      finally{
        setLoad(false)
      }
     
    }
    function live(e){
       const val=e.target.value;
       setSearchInputValue(val)
       const d=jobs.filter((items)=>{
         return items.title.toLowerCase().includes(val.toLowerCase())
    });
    setData(d)

    }
    function handle(){
      const d=jobs.filter((items)=>{
        return  items.title.toLowerCase().includes(searchInputValue.toLowerCase());
       }
      )
      setData(d)
     }
    function getJobId(obj){
      nav(`../${obj.jobId}`,{state:obj})
    }
    useEffect(()=>{
      getJobs()
    },[])
     console.log(jobs)
  
  return (
    <div >
      <div>
      <input type="text" placeholder="search..." value={searchInputValue} onChange={live}/>
      <button className="btn btn-success" onClick={handle}>search</button>
      {data.length===0 && !load && !err &&(
       <p className="text-danger display-3 text-center m-5">No jobs found </p>
      )}
      </div>
     {
      data.map((id)=>(
        
        <div key={id.jobId} className="card m-3 text-white " style={{backgroundColor:"black"}} >
        
        <div className='card-header ' style={{border:"solid white 1px"}}>
         <div className="d-flex justify-content-between">
         <h2 className="">{id.title} crop</h2>
        <div><img src= {id.farmerData.profileImageUrl} width="40px"/>
        <p>{id.farmerData.email.substring(0,10)+"..."}</p>
          </div>
          </div>
        </div>
        <div className='card-body'>
        <div className="d-flex justify-content-between">
         <p className="lead ">{id.content.substring(0,40)+"...."}</p> 
          <p className="lead text-danger "> ₹{id.wages}per day</p>
          <p className="lead">Location:{id.location}-{id.zipcode}</p>
          {/* <img src={id.fieldImage}/> */}
          <button className="btn btn-success" onClick={()=>getJobId(id)}>Apply Now</button>
         </div>
          </div>
        <div className="card-footer d-flex justify-content-between">
           
           <p className="lead">Created on:{id.DateOfCreation}</p>
           <p className="lead">Modified On:{id.DateOfModification}</p>
          </div>
          </div>
      ))
     }
    </div>
  )
}

export default Jobs