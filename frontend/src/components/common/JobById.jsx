import React, { useContext, useEffect ,useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createObj } from '../contexts/FarmerLabourContext';
import { useForm } from 'react-hook-form';
import client from '../../api/client';
import { useTranslation } from 'react-i18next'

function JobById() {
  const { currentUser, setCurrentUser } = useContext(createObj);
  const nav = useNavigate();
  const { t } = useTranslation()
  const [date,setDate]=useState('')
  const {register,handleSubmit,formState:{errors}}=useForm()
const [editStatus,setEditStatus]=useState(false)

  const loc = useLocation();
  const state = loc.state;
  console.log('Job ID from state:', state);
  const [cJob,setCJob]=useState(state)
  useEffect(()=>{
    const today=new Date().toISOString().split('T')[0];
    setDate(today)
   
  },[])
   function onEdit(){
    
    setEditStatus(true)
   }
  async function onSave(modified){
    console.log("modified",modified)
     const changes={...state,...modified}
     const d=new Date();
     changes.DateOfModification=d.getDate()+"_"+d.getMonth()+"_"+d.getFullYear()   
     console.log("changes",changes)
     let res=await client.patch(`/jobs/${changes._id}`,changes)
     console.log("message",res.data.message)
     if(res.data.message==='job updated')
     {
      setEditStatus(false)
      nav(`/farmerprofile/${currentUser.email}/${state.jobId}`,{state:changes})
     }
     
  }
console.log("state",state)
  async function deleteJob(){
    let res=await client.patch(`/jobs/${state._id}/close`)
    if(res.data.message==="job closed"){
        setCJob(res.data.payload)
        nav(`/farmerprofile/${currentUser.email}/jobs`)
    }
  }

  function onclick(){
    if(!currentUser){
      nav('/signin')
      return
    }
    const obj=state._id
    nav(`/labourprofile/${currentUser.email}/apply`,{state:obj})
  }
  return (
    <div className="fl-page">
      {
        editStatus === false ?
        <>
        
        {currentUser.role === 'farmer' ? (
        <>
           
          <div className="container">
          <div className="card fl-card">

            <div className="card-header bg-white d-flex flex-wrap gap-2 justify-content-between align-items-center">
              <div className="d-flex gap-2">
                <button type="button"className="btn btn-success " onClick={onEdit}>Edit</button>
                <button type="button"className="btn btn-secondary " onClick={()=>nav(`/farmerprofile/${currentUser.email}/app`,{state:{jobId:state._id}})}>Applications</button>
                <button type="button"className="btn btn-danger " onClick={deleteJob}>Close</button>
              </div>
              <div className="text-center flex-grow-1">
                <div className="fl-section-title">
                  {(() => {
                    const raw = state.title || ''
                    const key = raw.toLowerCase().trim().replace(/\s+/g,'_')
                    return t(`crops.${key}`, { defaultValue: raw })
                  })()}
                </div>
                <div className="small fl-muted">
                  {[
                    state.village,
                    state.mandal,
                    state.city,
                    state.location
                  ].filter(Boolean).join(', ')}{state.zipcode ? ` • ${state.zipcode}` : ''}
                </div>
              </div>
              
              <div>
                <img src={state.farmerData.profileImageUrl} width="40px" height="40px" className="rounded-circle" />
                <div className="small fl-muted text-end">{state.farmerData.nameOfFarmer}</div>
              </div>
            </div>
            <div className="card-body bg-white">
              <div className="row">
                <div className="col-md-8">
                  <div className="fl-section-title mb-2">About the work</div>
                  <p className="text-secondary">{state.content}</p>
                  <div className="mt-3 d-flex flex-wrap gap-2">
                    <span className="badge text-bg-success">₹{state.wages}/day</span>
                    <span className="badge text-bg-light border">Field: {state.fieldSize} </span>
                    <span className="badge text-bg-light border">Workers: {state.workersNeeded}</span>
                    <span className="badge text-bg-light border">Timing: {state.Timings}</span>
                    <span className="badge text-bg-light border">Zip: {state.zipcode}</span>
                    <span className="badge text-bg-light border">
                      {[
                        state.village,
                        state.mandal,
                        state.city,
                        state.location
                      ].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card fl-card">
                    <div className="card-body">
                      <h6 className="text-muted">Schedule</h6>
                      <div className="fw-semibold">Start: {new Date(state.startDate).toLocaleDateString()}</div>
                      <div className="fw-semibold">End: {new Date(state.endDate).toLocaleDateString()}</div>
                      <div className="mt-3 text-muted small">Created {state.DateOfCreation}</div>
                      <div className="text-muted small">Updated {state.DateOfModification}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </>
      ) : (
        <>
      
          <div className="container">
          <div className="card fl-card">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <div className="fl-section-title">
                {(() => {
                  const raw = state.title || ''
                  const key = raw.toLowerCase().trim().replace(/\s+/g,'_')
                  return t(`crops.${key}`, { defaultValue: raw })
                })()}
              </div>
              <button className="btn btn-success" onClick={onclick}>{t('jobs.applyNow')}</button>
            </div>
            <div className="card-body bg-white">
              <p className="text-secondary">{state.content}</p>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge text-bg-success">₹{state.wages}/day</span>
                <span className="badge text-bg-light border">Field: {state.fieldSize}</span>
                <span className="badge text-bg-light border">Workers: {state.workersNeeded}</span>
                <span className="badge text-bg-light border">Timing: {state.Timings}</span>
                <span className="badge text-bg-light border">Zip: {state.zipcode}</span>
                <span className="badge text-bg-light border">
                  {[
                    state.village,
                    state.mandal,
                    state.city,
                    state.location
                  ].filter(Boolean).join(', ')}
                </span>
              </div>
            </div>
          </div>
          </div>
        </>
      )}

        </>:

        <>
        <div className="container">
        <div className="card fl-card">
        <div className="card-body">
  <form onSubmit={handleSubmit(onSave)}>
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="fl-section-title">Edit Job</div>
      <button type="submit" className="btn btn-success">Save</button>
    </div>
    <div>
      <label htmlFor="title" className="form-label">Title</label>
      <input
      placeholder='Enter a Title'
        type="text"
        defaultValue={state.title}
        id="title"
        name="title"
        className="form-control"
        {...register('title', { required: "Enter correct details" })}
      />
      {errors.title && <p className="text-danger small mt-1"> {errors.title.message}</p>}
    </div>
    <div>
      <label htmlFor="content" className="form-label mt-3">Content</label>
      <textarea
        defaultValue={state.content}
        id="content"
        placeholder='Enter a content'
        name="content"
         className="form-control"
        {...register('content', { required: "Enter valid details" })}
      ></textarea>
      {errors.content && <p className="text-danger small mt-1">{errors.content.message}</p>}
    </div>
    <div className="row g-3 mt-1">
    <div className="col-md-6">
      <label htmlFor="wages" className="form-label">Wages</label>
      <input
       defaultValue={state.wages}
        type="number"
        id="wages"
         placeholder='enter wages(ruppes)'
        name="wages"
        min="100"
        max="100000"
        step="100"
        {...register('wages', { required: "Enter positive numbers" })}
         className="form-control"
      />
      {errors.wages && <p className="text-danger small mt-1">{errors.wages.message}</p>}
    </div>
    <div className="col-md-6">
      <label htmlFor="fieldSize" className="form-label">Field Size</label>
      <input
        type="number"
        defaultValue={state.fieldSize}
        id="fieldSize"
        name="fieldSize"
        min="1"
        max="100"
        placeholder="How many acres of land"
         className="form-control"
        {...register('fieldSize', { required: "FieldSize is required" })}
      />
      {errors.fieldSize && <p className="text-danger small mt-1">{errors.fieldSize.message}</p>}
    </div>
    <div className="col-md-6">
      <label htmlFor="startdate" className="form-label">Start Date</label>
      <input
      placeholder="dd/mm/yy"
      defaultValue={state.startdate}
        type="date"
        id="startdate"
        name="startdate"
        min={date}
         className="form-control"
        {...register('startDate', { required: "StartDate is required" })}
      />
      {errors.start && <p className="text-danger small mt-1">{errors.start.message}</p>}
     
    </div>
    <div className="col-md-6">
      <label htmlFor="enddate" className="form-label">End Date</label>
      <input
        type="date"
        id="enddate"
        name="enddate"
        min={date}
        defaultValue={state.enddate}
         className="form-control"
        {...register('endDate', { required: "EndDate is required" })}
      />
      {errors.enddate && <p className="text-danger small mt-1">{errors.enddate.message}</p>}
    </div>
    <div className="col-md-6">
      <label htmlFor="location" className="form-label">Location</label>
      <select
        id="location"
        name="location"
        defaultValue={state.location}
         className="form-select"
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
    
    <div className="col-md-6">
      <label htmlFor="zipcode" className="form-label">Zip Code</label>
      <input type="number"  defaultValue={state.zipcode} placeholder="XXXXXX"  id="zipcode" name="zipcode" min="100000" max="999999" {...register('zipcode',{required:"must have 6-digits"})} className="form-control"/>
      {errors.zipcode && <p className="text-danger small mt-1">{errors.zipcode.message}</p>}
    </div>
    <div className="col-md-6">
      <label htmlFor="timings" className="form-label">Timings</label>
      <select id="Timings" defaultValue={state.Timings}{...register('Timings',{required:"timings are required"})} className="form-select">
        <option value="select">Select a option</option>
        <option value="8 A.M.-5 P.M.">8 A.M.-5 P.M.</option>
        <option value="10 A.M.-5P.M.">10 A.M.-5P.M.</option>
      </select>
    </div>
    </div>
  </form>
        </div>
        </div>
        </div>
        </>
      }
      
    </div>
  );
}

export default JobById;
