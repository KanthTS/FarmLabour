import React,{useContext,useEffect,useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { createObj } from '../contexts/FarmerLabourContext';
import {useForm} from 'react-hook-form'
import client from '../../api/client'
import { useTranslation } from 'react-i18next'
import { locationData } from '../../locationData'

function CreatePost() {
const nav=useNavigate()
let [date,setDate]=useState('')
const {register,handleSubmit,formState:{errors}, setValue}=useForm()
const {currentUser}=useContext(createObj)
const { t } = useTranslation()
const [selectedState, setSelectedState] = useState('')
const [selectedCity, setSelectedCity] = useState('')
const [selectedMandal, setSelectedMandal] = useState('')

useEffect(()=>{
  const today=new Date().toISOString().split('T')[0];
  setDate(today)
  if(!currentUser || currentUser.role!=='farmer'){
    nav('/signin')
  }
},[currentUser])

function detailsOfpost(obj) {
  const d = new Date();

  obj.farmerData = {
    nameOfFarmer: currentUser.firstName,
    email: currentUser.email,
    profileImageUrl: currentUser.profileImageUrl || ""
  };

  obj.reviewData = {
    nameOfFarmer: currentUser.firstName,
    rating: currentUser.rating || 5,
    comment: currentUser.comment || "",
    profileImageUrl: currentUser.profileImageUrl || ""
  };

  obj.jobId = Date.now();
  obj.DateOfCreation = d.toISOString();
  obj.DateOfModification = obj.DateOfCreation;
  obj.isJobActive = true;

  client
    .post("/jobs", obj)
    .then((res) => {
      if (res.status === 201) {
        nav(`/farmerprofile/${currentUser.email}/jobs`);
      }
    })
    .catch((err) => {
      const msg = err.response?.data?.message || 'Something went wrong while submitting the job!';
      alert(msg);
    });
  }

  return (
    <div className="container py-4">
      <div className="card shadow-sm mx-auto" style={{maxWidth:'900px'}}>
        <div className="card-body">
          <h3 className="mb-3 text-center">{t('createPost.title')}</h3>
          <form onSubmit={handleSubmit(detailsOfpost)}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">{t('createPost.title')}</label>
                <input type="text" className="form-control" placeholder='Enter a Title' {...register('title', { required: "Enter correct details" })}/>
                {errors.title && <p className="text-danger small"> {errors.title.message}</p>}
              </div>
              <div className="col-md-6">
                <label className="form-label">{t('createPost.fieldSize')}</label>
                <input type="number" min="1" max="100" className="form-control" placeholder="How many acres of land" {...register('fieldSize', { required: "FieldSize is required" })}/>
                {errors.fieldSize && <p className="text-danger small">{errors.fieldSize.message}</p>}
              </div>
              <div className="col-md-12">
                <label className="form-label">{t('createPost.description')}</label>
                <textarea className="form-control" rows="2" placeholder='Enter details' {...register('content', { required: "Enter valid details" })}></textarea>
                {errors.content && <p className="text-danger small">{errors.content.message}</p>}
              </div>
              <div className="col-md-4">
                <label className="form-label">{t('createPost.wages')}</label>
                <input type="number" min="100" max="100000" step="50" className="form-control" placeholder='enter wages' {...register('wages', { required: "Enter positive numbers" })}/>
                {errors.wages && <p className="text-danger small">{errors.wages.message}</p>}
              </div>
              <div className="col-md-4">
                <label className="form-label">{t('createPost.workersNeeded')}</label>
                <input type="number" min="1" max="200" step="1" className="form-control" placeholder='Number of workers' {...register('workersNeeded', { required: "Enter workers needed" })}/>
                {errors.workersNeeded && <p className="text-danger small">{errors.workersNeeded.message}</p>}
              </div>
              <div className="col-md-4">
                <label className="form-label">{t('createPost.startDate')}</label>
                <input type="date" min={date} className="form-control" {...register('startDate', { required: "StartDate is required" })}/>
                {errors.start && <p className="text-danger small">{errors.start.message}</p>}
              </div>
              <div className="col-md-4">
                <label className="form-label">{t('createPost.endDate')}</label>
                <input type="date" min={date} className="form-control" {...register('endDate', { required: "EndDate is required" })}/>
                {errors.enddate && <p className="text-danger small">{errors.enddate.message}</p>}
              </div>
              <div className="col-md-6">
                <label className="form-label">{t('createPost.location')}</label>
                {(() => {
                  const locationRegister = register('location', { required: "Select correct details" })
                  return (
                    <select
                      className="form-select"
                      {...locationRegister}
                      onChange={(e) => {
                        locationRegister.onChange(e)
                        const code = e.target.value
                        setSelectedState(code)
                        setSelectedCity('')
                        setSelectedMandal('')
                        setValue('city', '')
                        setValue('mandal', '')
                        setValue('village', '')
                      }}
                    >
                  <option value="">{t('createPost.selectState')}</option>
                  <option value="AP">Andhra Pradesh</option>
                  <option value="AR">Arunachal Pradesh</option>
                  <option value="AS">Assam</option>
                  <option value="BR">Bihar</option>
                  <option value="CG">Chhattisgarh</option>
                  <option value="DL">Delhi</option>
                  <option value="GA">Goa</option>
                  <option value="GJ">Gujarat</option>
                  <option value="HR">Haryana</option>
                  <option value="HP">Himachal Pradesh</option>
                  <option value="JH">Jharkhand</option>
                  <option value="KA">Karnataka</option>
                  <option value="KL">Kerala</option>
                  <option value="MP">Madhya Pradesh</option>
                  <option value="MH">Maharashtra</option>
                  <option value="MN">Manipur</option>
                  <option value="ML">Meghalaya</option>
                  <option value="MZ">Mizoram</option>
                  <option value="NL">Nagaland</option>
                  <option value="OD">Odisha</option>
                  <option value="PB">Punjab</option>
                  <option value="RJ">Rajasthan</option>
                  <option value="SK">Sikkim</option>
                  <option value="TN">Tamil Nadu</option>
                  <option value="TS">Telangana</option>
                  <option value="TR">Tripura</option>
                  <option value="UP">Uttar Pradesh</option>
                  <option value="UK">Uttarakhand</option>
                  <option value="WB">West Bengal</option>
                    </select>
                  )
                })()}
                {errors.location && <p className="text-danger small">{errors.location.message}</p>}
              </div>
              {(() => {
                const stateCfg = locationData[selectedState]
                const cities = stateCfg ? Object.keys(stateCfg.cities || {}) : []
                const mandals = stateCfg && selectedCity
                  ? Object.keys(stateCfg.cities[selectedCity]?.mandals || {})
                  : []
                const villages = stateCfg && selectedCity && selectedMandal
                  ? Object.keys(
                      stateCfg.cities[selectedCity]?.mandals[selectedMandal]?.villages || {}
                    )
                  : []

                return (
                  <>
                    <div className="col-md-6">
                      <label className="form-label">{t('createPost.city')}</label>
                      {stateCfg ? (
                        <select
                          className="form-select"
                          value={selectedCity}
                          onChange={(e) => {
                            const val = e.target.value
                            setSelectedCity(val)
                            setSelectedMandal('')
                            setValue('city', val)
                            setValue('mandal', '')
                            setValue('village', '')
                          }}
                        >
                          <option value="">Select city</option>
                          {cities.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      ) : (
                        <input type="text" className="form-control" placeholder="City or town" {...register('city')} />
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">{t('createPost.mandal')}</label>
                      {stateCfg && selectedCity ? (
                        <select
                          className="form-select"
                          value={selectedMandal}
                          onChange={(e) => {
                            const val = e.target.value
                            setSelectedMandal(val)
                            setValue('mandal', val)
                            setValue('village', '')
                          }}
                        >
                          <option value="">Select mandal</option>
                          {mandals.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      ) : (
                        <input type="text" className="form-control" placeholder="Mandal" {...register('mandal')} />
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">{t('createPost.village')}</label>
                      {stateCfg && selectedCity && selectedMandal ? (
                        <select
                          className="form-select"
                          onChange={(e) => {
                            const val = e.target.value
                            setValue('village', val)
                            const zip =
                              stateCfg.cities[selectedCity]
                                ?.mandals[selectedMandal]
                                ?.villages[val] || ''
                            if (zip) {
                              setValue('zipcode', zip)
                            }
                          }}
                        >
                          <option value="">Select village</option>
                          {villages.map((v) => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                      ) : (
                        <input type="text" className="form-control" placeholder="Village" {...register('village')} />
                      )}
                    </div>
                  </>
                )
              })()}
              <div className="col-md-6">
                <label className="form-label">{t('createPost.timings')}</label>
                <input type="text" className="form-control" placeholder={t('createPost.timingsPlaceholder')} {...register('Timings', { required: "Timings is required" })}/>
                {errors.Timings && <p className="text-danger small">{errors.Timings.message}</p>}
              </div>
              <div className="col-md-6">
                <label className="form-label">{t('createPost.zipCode')}</label>
                <input
                  type="number"
                  min="100000"
                  max="999999"
                  className="form-control"
                  placeholder="XXXXXX"
                  {...register('zipcode',{required:"must have 6-digits"})}
                />
                {errors.zipcode && <p className="text-danger small">{errors.zipcode.message}</p>}
              </div>
            </div>
            <div className="d-flex justify-content-end mt-4">
              <button type="submit" className='btn btn-primary px-4'>{t('createPost.publish')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreatePost
