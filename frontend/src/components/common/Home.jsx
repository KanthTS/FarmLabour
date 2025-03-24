
import image from '/Users/lakshmikanth/Farmers and Labourers/frontend/src/images/farmer-labourer.jpg'
import { MdDone } from "react-icons/md";
import { MdOutlineAccessTime } from "react-icons/md";
import { BiSolidLayer } from "react-icons/bi";
import { useUser } from '@clerk/clerk-react';
import { useContext, useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'
import { createObj } from '../contexts/FarmerLabourContext';
import axios from 'axios'
function Home() {
const navigate=useNavigate();
    const {currentUser,setCurrentUser}=useContext(createObj)
     const {isSignedIn,user,isLoaded}=useUser()
     console.log(isLoaded)
     console.log(isSignedIn)
     console.log(user)
     const [err,setErr]=useState('')
    useEffect(()=>{
      setCurrentUser({
        ...currentUser,
        firstName:user?.firstName,
        lastName:user?.lastName,
        // phoneNo:user?.phoneNo,
        // location:user?.location,
        profileImageUrl:user?.imageUrl,
        email:user?.emailAddresses[0]?.emailAddress
      })
    },[isLoaded])
      useEffect(()=>{
         if(currentUser?.role==='farmer' &&err.length===0 ){
          navigate(`/farmerprofile/${currentUser?.email}`)
         }
       if(currentUser?.role==='labour' && err.length===0 ){
        navigate(`/labourprofile/${currentUser?.email}`)
       }
      },[currentUser?.role])
      async function Farmerclick(e){
        setErr('')
         let selectedrole=e.target.value;
          let res=null;
         let updateUser={...currentUser,role:selectedrole};
         if(selectedrole==='farmer'){
           res=await axios.post('http://localhost:3000/farmer-api/farmer',updateUser)
          let {message,payload}=res.data;
          if(message=='farmer'){
            setCurrentUser({...updateUser,...payload})
          }
          else{
            setErr(message);
          }
         }
         if(selectedrole==='labour'){
          res=await axios.post('http://localhost:3000/labour-api/labour',updateUser)
          let {message,payload}=res.data;
          if(message=='labour'){
            setCurrentUser({...updateUser,...payload})
          }
          else{
            setErr(message);
          }
         }
      }




  return (
    <div>{
      !isSignedIn?<>
      
<div className="bg-black">
      <marquee direction="right" style={{fontFamily:"san-serif",fontSize:"20px",color:"white"}}>Here,farmers can post jobs and Labourers can apply for job . </marquee>
          <div className="heading">
          <h1 >Connect Farmers With Local Labour</h1>
          <p >Streamline agricultural workforce management by connecting farmers with skilled laborers in your area</p>
          </div>
          <div className="but">
          <button className="btn btn-success">Farmer</button>
          <button className="btn btn-success ">Labour</button>
          </div>
          <img src={image} width="100%" height="700px"   />
        <h2 className="text-white"style={{fontFamily:"sans-serif",fontSize:"70px",textAlign:"center",position:"absolute",left:"17%",top:"90%"}}>Connect Farm Work & Workers</h2>
        <p  className="text-white"style={{fontFamily:"sans-serif",fontSize:"20px",textAlign:"center",position:"absolute",left:"17%",top:"110%"}}>The easiest way to find agricultural labor or work opportunities. Post jobs, find work, and grow together.</p>
      
          <div className="box text-center" >

            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 " style={{position:"absolute",left:"15%",top:"130%"}}>
              <div style={{border:"solid",padding:"20px",borderRadius:"20px",borderColor:"green",backgroundColor:"black",color:"white"}}>
              <h2>Easy Posting</h2>
              <p>Post your farm work requirements in minutes</p>
              </div>
              <div style={{border:"solid",padding:"20px",borderRadius:"20px",borderColor:"green",backgroundColor:"black",color:"white"}}>
              <h2>Quick Matching</h2>
              <p>Connect with verified farm workers near you</p>
              </div>
              <div style={{border:"solid",padding:"20px",borderRadius:"20px",borderColor:"green",backgroundColor:"black",color:"white"}}>
                <h2>Secure Platform</h2>
                <p>Safe and transparent work arrangements</p>
              </div>
            </div>
            </div>
            <section id="howitworks">
            <h2 className="text-center text-white m-3">How it Works</h2>  
            <p className="lead text-white text-center" >Simple steps to connect farmers with laborers</p>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 m-3">
              <div style={{border:"solid",borderRadius:"10px",textAlign:"start",padding:"20px"}}>
                <h4 style={{color:"white"}}>For Farmers</h4>
                <ol type="1 " style={{color:"green"}}>
                   <li style={{fontFamily:"sans-serif",fontSize:"20px",color:"white"}}>Create Job Post</li>
                   <p>Specify crop type, required workers, duration, and payment details</p>
                   <li style={{fontFamily:"sans-serif",fontSize:"20px",color:"white"}}>Review Applications</li>
                   <p>Select workers based on their experience and ratings</p>
                   <li style={{fontFamily:"sans-serif",fontSize:"20px",color:"white"}}>Start Work</li>
                   <p>Begin work with selected laborers on agreed date</p>
                </ol>
               
              </div>
              <div style={{border:"solid",borderRadius:"10px",textAlign:"start",padding:"20px"}}>
                <h4 style={{color:"white"}}>For Laborers</h4>
                <ol type="1" style={{color:"green"}}>
                   <li style={{fontFamily:"sans-serif",fontSize:"20px",color:"white"}}>Browse Jobs</li>
                   <p>Find work opportunities in your area and expertise</p>
                   <li style={{fontFamily:"sans-serif",fontSize:"20px",color:"white"}}>Apply for Work</li>
                   <p>Submit application with your experience details.</p>
                   <li style={{fontFamily:"sans-serif",fontSize:"20px",color:"white"}}>Complete Tasks</li>
                   <p>Work and earn based on agreed terms</p>
                </ol>
                
              </div>
             <div style={{border:"solid",borderRadius:"10px",textAlign:"start",padding:"20px"}}>
             <h4 style={{color:"white"}}>Platform Benefits</h4>
              <MdDone style={{ fontSize:"30px",background:"green",border:"solid",borderRadius:"50px"}}/>
              <h5 style={{color:"white"}}>Verified Profiles</h5>
              <p style={{color:"green"}}>All users are verified for safety and trust</p>
               <MdOutlineAccessTime style={{ fontSize:"30px",background:"green",border:"solid",borderRadius:"50px"}}/>
               <h5 style={{color:"white"}}>Quick Process</h5>
               <p style={{color:"green"}}> Efficient matching and work assignment</p>
               <BiSolidLayer style={{ fontSize:"30px",background:"green",border:"solid",borderRadius:"50px"}}/>
               <h5 style={{color:"white"}}>Secure Payments</h5>
               <p style={{color:"green"}}>Safe and transparent payment system</p>
             </div>
            </div>
            </section>
    </div>

      </>:
      <>
      <div className="text-center">
      <h5>Select a role </h5>
      <div >
      {
        err!='' &&(
        <p className="text-danger">{err}</p>
        )
      }  <input type="radio" id="farmer" value="farmer" name="role" className="p-3 " onClick={Farmerclick} />
      <label htmlFor='farmer' className="m-3 text-success ">Farmer</label>
      <input type="radio" id="labour" value="labour" name="role" className="p-3 " onClick={Farmerclick}/>
          <label htmlFor='labour'  className="m-3 text-success ">Labour</label>
    
      </div>
       
    </div>
    
      
      </>
   }
    </div>
  )
}

export default Home


