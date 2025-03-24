import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createObj } from '../contexts/FarmerLabourContext'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
function ApplyJob() {
const state=useLocation()
console.log(state)
  const {register,handleSubmit,formState:{errors}}=useForm()
  const {currentUser,setCurrentUser}=useContext(createObj)
  const nav=useNavigate()
  async function clickObj(obj) {
    console.log(obj)
    obj.jobId = state.state; // Ensure state has jobId
    const d = new Date();
    obj.applicationId=Date.now()
    obj.dateOfCreation=`${d.getDate()}_${d.getMonth() + 1}_${d.getFullYear()}_${d.toLocaleTimeString('en-US', { hour12: true })}`;
     const labourData={
      email:currentUser.email,
      nameOfLabour:currentUser.firstName,
      profileImageUrl:currentUser.profileImageUrl
     }     
     obj.labourData=labourData;
   
      const res = await axios.post('http://localhost:3000/labour-api/application', obj);
      console.log(res);
      if (res.status === 201) {
        nav(`/labourprofile/${currentUser.email}/app`,{state:obj});
      }
   }
  return (
    <div>
      <h2 className="text-center" >Application</h2>
       <form onSubmit={handleSubmit(clickObj)} className='form-control w-50 mx-auto text-center '>
       <div>
        <label htmlFor="fullname" className='fs-5 form-label'>Full Name:</label>
           <input type="text" id="fullname" placeholder="Enter full name" className="m-3 w-50 " {...register('fullname',{required:"must be your full name"})}/>
         {errors.fullname && <p className="text-danger">{errors.fullname.message}</p>}
       </div>
       
       <div>
          <label htmlFor="experience" className="fs-5 form-label">Experience:</label>
          <input
          placeholder="Enter your Experience"
            className="m-3 w-50 "
            type="text"
            id="experience"
            name="experience"
            {...register('experience',{required:"must be above 1 year"})}
          />
          {errors.experience && <p className="text-danger ">{errors.experience.message}</p>}
        </div>

        <div>
          <label htmlFor="workinghours" className="fs-5">Working Hours:</label>
          <select id="workinghours" placeholder="Select Full-time/part-Time"  className="m-3 w-50  " name="workinghours" {...register('workinghours',{required:"working hours must be included"})}>
          <option value="">select working-hours</option>
            <option value="part-time">Part-Time</option>
            <option value="full-time">Full-Time</option>

          </select>
          {errors.workinghours && <p>{errors.workinghours.message}</p>}
        </div>

        <div>
          <label htmlFor="skills" className="fs-5">Skills:</label>
          <input
          placeholder="Select Your Skills"
            className="m-3 w-50  "
            type="text"
            id="skills"
            name="skills"
           {...register('skills',{required:"must include your skills"})}
          />
          {errors.skills && <p className="text-danger">{errors.skills.message}</p>}
        </div>
        <div>
      <label htmlFor="location" className="fs-5">Location:</label>
      <select
        id="location"
        name="location"
         className="m-3 w-50  "
         style={{backgroundColor:"transparent",border:"solid 1px red"}}
        {...register('location', { required: "Select correct details" })}
      >
         <option value="">Select a state</option>
  
  <option value="AN">Andaman and Nicobar Islands</option>
  <option value="AN-PORTBLER">Port Blair</option>
  
  <option value="AP">Andhra Pradesh</option>
  <option value="AP-VISAKHAPATNAM">Visakhapatnam</option>
  <option value="AP-AMARAVATI">Amaravati</option>
  
  <option value="AR">Arunachal Pradesh</option>
  <option value="AR-ITANAGAR">Itanagar</option>
  
  <option value="AS">Assam</option>
  <option value="AS-GUWAHATI">Guwahati</option>
  <option value="AS-DIBRUGARH">Dibrugarh</option>
  
  <option value="BR">Bihar</option>
  <option value="BR-PATNA">Patna</option>
  
  <option value="CG">Chhattisgarh</option>
  <option value="CG-RAIPUR">Raipur</option>
  
  <option value="DL">Delhi</option>
  <option value="DL-NEWDELHI">New Delhi</option>
  
  <option value="GA">Goa</option>
  <option value="GA-PANAJI">Panaji</option>
  
  <option value="GJ">Gujarat</option>
  <option value="GJ-AHMEDABAD">Ahmedabad</option>
  <option value="GJ-VADODARA">Vadodara</option>
  
  <option value="HR">Haryana</option>
  <option value="HR-CHANDIGARH">Chandigarh</option>
  
  <option value="HP">Himachal Pradesh</option>
  <option value="HP-SHIMLA">Shimla</option>
  
  <option value="JH">Jharkhand</option>
  <option value="JH-RANCHI">Ranchi</option>
  
  <option value="KA">Karnataka</option>
  <option value="KA-BENGALURU">Bengaluru</option>
  
  <option value="KL">Kerala</option>
  <option value="KL-THIRUVANANTHAPURAM">Thiruvananthapuram</option>
  <option value="KL-ERNAKULAM">Kochi</option>
  
  <option value="MP">Madhya Pradesh</option>
  <option value="MP-BHOPAL">Bhopal</option>
  <option value="MP-INDORE">Indore</option>
  
  <option value="MH">Maharashtra</option>
  <option value="MH-MUMBAI">Mumbai</option>
  <option value="MH-PUNE">Pune</option>
  
  <option value="MN">Manipur</option>
  <option value="MN-IMPHAL">Imphal</option>
  
  <option value="ML">Meghalaya</option>
  <option value="ML-SHILLONG">Shillong</option>
  
  <option value="MZ">Mizoram</option>
  <option value="MZ-AIZAWL">Aizawl</option>
  
  <option value="NL">Nagaland</option>
  <option value="NL-KOHIMA">Kohima</option>
  
  <option value="OD">Odisha</option>
  <option value="OD-BHUBANESWAR">Bhubaneswar</option>
  
  <option value="PY">Puducherry</option>
  <option value="PY-PUDUCHERRY">Puducherry</option>
  
  <option value="PB">Punjab</option>
  <option value="PB-CHANDIGARH">Chandigarh</option>
  <option value="PB-AMRITSAR">Amritsar</option>
  
  <option value="RJ">Rajasthan</option>
  <option value="RJ-JAIPUR">Jaipur</option>
  <option value="RJ-UDDIPUR">Udaipur</option>
  
  <option value="SK">Sikkim</option>
  <option value="SK-GANGTOK">Gangtok</option>
  
  <option value="TN">Tamil Nadu</option>
  <option value="TN-CHENNAI">Chennai</option>
  <option value="TN-MADURAI">Madurai</option>
  
  <option value="TS">Telangana</option>
  <option value="TS-HYDERABAD">Hyderabad</option>
  
  <option value="TR">Tripura</option>
  <option value="TR-AGARTALA">Agartala</option>
  
  <option value="UP">Uttar Pradesh</option>
  <option value="UP-LUCKNOW">Lucknow</option>
  <option value="UP-KANPUR">Kanpur</option>
  
  <option value="UK">Uttarakhand</option>
  <option value="UK-DEHRA DUN">Dehradun</option>
  
  <option value="WB">West Bengal</option>
  <option value="WB-KOLKATA">Kolkata</option>
      </select>
      {errors.location && <p className="text-danger">{errors.location.message}</p>}
    </div>
        <button type="submit" className='btn btn-success'>Submit</button>
       </form>
    </div>
  )
}

export default ApplyJob

