import React,{useEffect, useState, useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import client from '../../api/client'
import { createObj } from '../contexts/FarmerLabourContext'
import { useTranslation } from 'react-i18next'

function Jobs() {
    const nav=useNavigate()
    const [jobs,setJobs]=useState([])
    const [err,setErr]=useState('')
    const [load,setLoad]=useState(false)
    const [editStatus,setEditStatus]=useState(false)
    const [searchInputValue,setSearchInputValue]=useState('')
    const [locationInputValue,setLocationInputValue]=useState('')
    const [data,setData]=useState([])
    const {currentUser}=useContext(createObj)
    const { t, i18n } = useTranslation()
  async function getJobs(query='', location=''){
    setLoad(true)
    try{
      const params = { isJobActive: true }
      if(query) params.search = query
      if(location) params.location = location
      let res=await client.get('/jobs',{params})
      if(res.data.message==='jobdetails'){
        setJobs(res.data.payload)
        setData(res.data.payload)
      }else{
        setErr(res.data.message)
      }
    }
    catch(error){
      setErr('fetching no jobs')
    }
    finally{
      setLoad(false)
    }
   }


    function live(e){
       const val=e.target.value;
       setSearchInputValue(val)
       const d=jobs.filter((items)=>{
         return items.title.toLowerCase().includes(val.toLowerCase()) ||
                items.location.toLowerCase().includes(val.toLowerCase())
    });
    setData(d)

    }
    function handle(){
      getJobs(searchInputValue, locationInputValue)
     }
    function getJobId(obj){
      nav(`../${obj.jobId}`,{state:obj})
    }
    useEffect(()=>{
      getJobs()
    },[])
  
  return (
    <div className="fl-page">
      <div className="container">
      <div className="fl-card p-3 mb-3">
      <div className="d-flex flex-wrap align-items-center gap-2">
        <input type="text" placeholder={t('jobs.searchTitle')} value={searchInputValue} onChange={live} className="form-control w-auto"/>
        <input type="text" placeholder={t('jobs.filterLocation')} value={locationInputValue} onChange={(e)=>setLocationInputValue(e.target.value)} className="form-control w-auto"/>
        <button className="btn btn-success" onClick={handle}>{t('jobs.search')}</button>
        <button className="btn btn-secondary" onClick={()=>{setSearchInputValue(''); setLocationInputValue(''); getJobs();}}>{t('jobs.clear')}</button>
      </div>
      </div>
      {data.length===0 && !load && !err &&(
       <p className="text-danger display-3 text-center m-5">{t('jobs.noJobs')}</p>
      )}
     {
      data.map((id)=>(
        
        <div key={id.jobId} className="card fl-card fl-card-hover mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h4 className="mb-1">
                  {(() => {
                    const raw = id.title || ''
                    const key = raw.toLowerCase().trim().replace(/\s+/g,'_')
                    // Use dictionary translation if available, else fallback to original
                    return t(`crops.${key}`, { defaultValue: raw })
                  })()}
                </h4>
                <div className="text-muted small">
                  {[
                    id.village,
                    id.mandal,
                    id.city,
                    id.location
                  ].filter(Boolean).join(', ')}{id.zipcode ? ` • ${id.zipcode}` : ''}
                </div>
                <div className="mt-2">
                  <span className="badge text-bg-success me-2">₹{id.wages}/day</span>
                  <span className="badge text-bg-light border me-2">{id.fieldSize}</span>
                  <span className="badge text-bg-light border me-2">{t('jobs.workers')}: {id.workersNeeded || '-'}</span>
                  <span className="badge text-bg-light border">{id.Timings}</span>
                </div>
              </div>
              <div className="text-end">
                {(() => {
                  const email = id.farmerData?.email || 'U'
                  const nameFromEmail = email.split('@')[0] || 'U'
                  const avatarText = encodeURIComponent(nameFromEmail)
                  const src = id.farmerData?.profileImageUrl
                    ? id.farmerData.profileImageUrl
                    : `https://ui-avatars.com/api/?name=${avatarText}`
                  return (
                    <img
                      src={src}
                      width="44"
                      height="44"
                      className="rounded-circle"
                      alt="farmer"
                    />
                  )
                })()}
              </div>
            </div>
            <p className="mt-3 text-secondary">{id.content.substring(0,120)}...</p>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <div className="small text-muted">
                {t('jobs.fromTo', {
                  start: new Date(id.startDate).toLocaleDateString(),
                  end: new Date(id.endDate).toLocaleDateString()
                })}
              </div>
              <button className="btn btn-primary" onClick={()=>getJobId(id)}>
                {currentUser?.role==='labour' ? t('jobs.applyNow') : t('jobs.view')}
              </button>
            </div>
          </div>
        </div>
      ))
     }
    </div>
    </div>
  )
}

export default Jobs
