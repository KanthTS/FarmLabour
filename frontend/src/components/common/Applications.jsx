import React, { useContext, useEffect, useState } from 'react';
import { createObj } from '../contexts/FarmerLabourContext';
import { useLocation, useNavigate } from 'react-router-dom';
import client from '../../api/client'
import { useTranslation } from 'react-i18next'


function Applications() {
   const {currentUser,setCurrentUser}=useContext(createObj)
  //  const [approvedId,setApprovedId]=useState([])
  const [app,setApp]=useState([])
  const [input,setInput]=useState('')
  const [err,setErr]=useState('');
  const [load,setLoad]=useState(false)
   const [data,setData]=useState([])
   const { t } = useTranslation()
   const nav=useNavigate()
   const loc=useLocation()
   const jobId=loc.state?.jobId
   async function getApp(){
     setLoad(true)
     try{
      let res
      if(currentUser?.role==='labour'){
        res = await client.get(`/applications/mine`)
      }else if(jobId){
        res = await client.get(`/jobs/${jobId}/applications`)
      }else{
        res = await client.get(`/applications/mine`)
      }
      if(res.data.message==='applications'){
        setApp(res.data.payload)
        setData(res.data.payload)
      }
      else{
        setErr(res.data.message)
      }
     }catch(error){
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
   async function updateStatus(id,status){
    let res=await client.patch(`/applications/${id}`,{status})
    setData((prev)=>prev.map((item)=>item._id===id?res.data.payload:item))
   }
   
  //  useEffect(()=>{
  //  const stored=localStorage.getItem('currentUser');
  //  if (stored) {
  //   setCurrentUser(JSON.parse(stored));
  // }
  //  },[])
   
  //  useEffect(()=>{
  //     if(currentUser){
  //       localStorage.setItem('currentUser',JSON.stringify('currentUser'))
  //     }
  //  },[])

   useEffect(()=>{
    getApp()
   },[])
 
  return (
    <div className="fl-page">
    <div className="container">
     <div className="fl-card p-3 mb-3">
     <div className="d-flex align-items-center gap-2">
       <input type="text" placeholder={t('applications.searchSkillsPlaceholder')} value={input} onChange={live} className="form-control"/>
       <button  onClick={handle} className="btn btn-success" >{t('applications.search')}</button>
       <span className="text-muted small ms-2">{t('applications.count', { count: data.length })}</span>
     </div>
     </div>
      {data.length===0 && !load && !err && (
      <p className="text-danger">{t('applications.noResults')}</p>
      )}
      {
       data.map((id)=>(
       <div key={id.applicationId}>
        <div className="card fl-card fl-card-hover mb-3">
         <div className="card-header d-flex justify-content-between align-items-center">
           <div>
             <p className="lead mb-0">{id.fullname}</p>
             <div className="text-muted small">{id.labourData.email}</div>
           </div>
           {id.labourData.profileImageUrl && <img src={id.labourData.profileImageUrl} width="40px" className="rounded-circle"/>}
          </div>
          <div className="card-body ">
           <p className="mb-1"><strong>{t('applications.skills')}:</strong> {id.skills}</p>
           <p className="mb-1"><strong>{t('applications.workingHours')}:</strong> {id.workinghours}</p>
           <p className="mb-1"><strong>{t('applications.location')}:</strong> {id.location}</p>
           <p className="mb-1 text-muted small">{t('applications.jobId')}: {id.jobId}</p>
            </div>
            <div className="card-footer d-flex justify-content-between align-items-center">
              <div className="small text-muted">
                {t('applications.created')} {new Date(id.dateOfCreation).toLocaleDateString()}
              </div>
              {
                currentUser?.role === 'labour' ?
                    <button className="btn btn-success" disabled>{id.status}</button>
                    :
                    <div className="d-flex gap-2 align-items-center">
                      <span className="badge text-bg-secondary">{id.status}</span>
                      <button className="btn btn-outline-success btn-sm" onClick={() => updateStatus(id._id,'shortlisted')}>{t('applications.shortlist')}</button>
                      <button className="btn btn-success btn-sm" onClick={() => updateStatus(id._id,'hired')}>{t('applications.hire')}</button>
                      <button className="btn btn-danger btn-sm" onClick={() => updateStatus(id._id,'rejected')}>{t('applications.reject')}</button>
                    </div>
                }
              </div>
          </div>
       </div>


       ))
      }
    </div>
    </div>
  )
}

export default Applications
