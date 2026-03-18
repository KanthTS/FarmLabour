import image from '../../images/farmer-labourer.jpg'
import { MdDone } from "react-icons/md";
import { MdOutlineAccessTime } from "react-icons/md";
import { BiSolidLayer } from "react-icons/bi";
import { useTranslation } from 'react-i18next';
import { useContext, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import { createObj } from '../contexts/FarmerLabourContext';

function Home() {
  const navigate=useNavigate();
  const {currentUser}=useContext(createObj)
  const { t } = useTranslation()
  useEffect(()=>{
    if(currentUser?.role==='farmer'){
      navigate(`/farmerprofile/${currentUser?.email}`)
    }
    if(currentUser?.role==='labour'){
      navigate(`/labourprofile/${currentUser?.email}`)
    }
  },[currentUser?.role])

  return (
    <div>
      <div className="bg-dark text-white">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-5 fw-bold">{t('home.heroTitle')}</h1>
              <p className="lead">{t('home.heroSubtitle')}</p>
              <div className="d-flex gap-3">
                <button className="btn btn-success" onClick={()=>navigate('/signup')}>{t('home.findWorkers')}</button>
                <button className="btn btn-outline-light" onClick={()=>navigate('/signup')}>{t('home.findJobs')}</button>
              </div>
              <div className="mt-4 d-flex gap-4">
                <div><span className="fw-bold">5k+</span><div className="text-white-50 small">{t('home.workers')}</div></div>
                <div><span className="fw-bold">2k+</span><div className="text-white-50 small">{t('home.jobsPosted')}</div></div>
                <div><span className="fw-bold">24h</span><div className="text-white-50 small">{t('home.avgFillTime')}</div></div>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <img src={image} className="img-fluid rounded" alt="Farm labour"/>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row row-cols-1 row-cols-md-3 g-3">
          <div className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h4>{t('home.easyPostingTitle')}</h4>
                <p className="text-muted">{t('home.easyPostingDesc')}</p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h4>{t('home.quickMatchingTitle')}</h4>
                <p className="text-muted">{t('home.quickMatchingDesc')}</p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h4>{t('home.trustedNetworkTitle')}</h4>
                <p className="text-muted">{t('home.trustedNetworkDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        <h2 className="text-center mb-3">{t('home.howItWorksTitle')}</h2>
        <p className="text-center text-muted mb-4">{t('home.howItWorksSubtitle')}</p>
        <div className="row row-cols-1 row-cols-md-3 g-3">
          <div className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5>{t('home.forFarmers')}</h5>
                <ol className="small">
                  <li>{t('home.createJobPost')}</li>
                  <li>{t('home.reviewApplications')}</li>
                  <li>{t('home.hireAndStart')}</li>
                </ol>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5>{t('home.forLabourers')}</h5>
                <ol className="small">
                  <li>{t('home.browseNearbyJobs')}</li>
                  <li>{t('home.applyWithSkills')}</li>
                  <li>{t('home.trackAndHired')}</li>
                </ol>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5>{t('home.platformBenefits')}</h5>
                <div className="small"><MdDone className="me-2"/> {t('home.verifiedProfiles')}</div>
                <div className="small"><MdOutlineAccessTime className="me-2"/> {t('home.fasterMatching')}</div>
                <div className="small"><BiSolidLayer className="me-2"/> {t('home.transparentProcess')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
