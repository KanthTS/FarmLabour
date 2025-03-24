import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createObj } from '../contexts/FarmerLabourContext';


function JobById() {
  const { currentUser, setCurrentUser } = useContext(createObj);
  const nav = useNavigate();

  const loc = useLocation();
  const state = loc.state;
  console.log('Job ID from state:', state);

  function onclick(){
    const obj=state._id
    console.log(obj)
    nav(`/labourprofile/${currentUser.email}/apply`,{state:obj})
  }
  return (
    <div>
      {currentUser.role === 'farmer' ? (
        <>
          <div className="card container" style={{ backgroundColor: "lightblue" }}>
            <div className="card-header d-flex justify-content-between">
              <h5 className="lead" style={{ color: "tan", padding: "20px", fontFamily: "sans-serif", fontSize: "25px" }}>
                {state.title}
              </h5>
              <div>
                <img src={state.farmerData.profileImageUrl} width="40px" />
                <p className="lead">{state.farmerData.nameOfFarmer}</p>
              </div>
            </div>
            <div className="card-body" style={{ backgroundColor: "wheat" }}>
              <h5>Content:</h5>
              <p className="lead text-start">{state.content}</p>
              <h5>Field Size:</h5>
              <p className="lead">I have nearly <span className="text-primary" style={{ border: "solid 1px", borderRadius: "50%", padding: "5px" }}>{state.fieldSize}</span> acres of field</p>
              <h5>Wages:</h5>
              <p className="lead">I will pay nearly <span className="text-danger">₹{state.wages}</span> Rupees per day</p>
              <h5>Start Date:</h5>
              <p>The starting Date from <span className="text-danger">{state.startDate}</span></p>
              <h5>End Date:</h5>
              <p>The ending Date from <span className="text-danger">{state.endDate}</span></p>
              <h5>ZipCode:</h5>
              <p className="text-success">{state.zipcode}</p>
              <h5>Timings:</h5>
              <p className="text-success">{state.Timings}</p>
            </div>
            <div className="card-footer">
              <div className="d-flex justify-content-between">
                <p>Created on.. {state.DateOfCreation}</p>
                <button className="text-success text-center" >Apply Now</button>
                <p>Modified on.. {state.DateOfModification}</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="card container" style={{ backgroundColor: "lightblue" }}>
            <div className="card-header d-flex justify-content-between">
              <h5 className="lead" style={{ color: "tan", padding: "20px", fontFamily: "sans-serif", fontSize: "25px" }}>
                {state.title}
              </h5>
              <div>
                <img src={state.farmerData.profileImageUrl} width="40px" />
                <p className="lead">{state.farmerData.nameOfFarmer}</p>
              </div>
            </div>
            <div className="card-body" style={{ backgroundColor: "wheat" }}>
              <h5>Content:</h5>
              <p className="lead text-start">{state.content}</p>
              <h5>Field Size:</h5>
              <p className="lead">I have nearly <span className="text-primary" style={{ border: "solid 1px", borderRadius: "50%", padding: "5px" }}>{state.fieldSize}</span> acres of field</p>
              <h5>Wages:</h5>
              <p className="lead">I will pay nearly <span className="text-danger">₹{state.wages}</span> Rupees per day</p>
              <h5>Start Date:</h5>
              <p>The starting Date from <span className="text-danger">{new Date(state.startDate).toISOString().split('T')[0]}</span></p>
              <h5>End Date:</h5>
              <p>The ending Date from <span className="text-danger">{new Date(state.endDate).toISOString().split('T')[0]}</span></p>
              <h5>ZipCode:</h5>
              <p className="text-success">{state.zipcode}</p>
              <h5>Timings:</h5>
              <p className="text-success">{state.Timings}</p>
            </div>
            <div className="card-footer">
              <div className="d-flex justify-content-between">
                <p>Created on.. {state.DateOfCreation}</p>
                <button className="text-success text-center" onClick={onclick}>Apply Now</button>
                <p>Modified on.. {state.DateOfModification}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default JobById;
