import React,{useContext,useEffect,useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { createObj } from '../contexts/FarmerLabourContext';
import axios from 'axios'
import {useForm} from 'react-hook-form'
import image from '/Users/lakshmikanth/Farmers and Labourers/frontend/src/images/modern-background-social-media-icons_1017-4839.jpg'
function CreatePost() {
const nav=useNavigate()
let [date,setDate]=useState('')
let [fieldImage,setFieldImage]=useState('')
let [images,set]=useState([]);
// function change(e){
//   console.log(e.target.files[0])
//    setFieldImage(e.target.files[0])
// }
useEffect(()=>{
  const today=new Date().toISOString().split('T')[0];
  setDate(today)
  // getImages()
},[])
// async function submit(){
//     const formData=new FormData()
//     formData.append('file',fieldImage)
//    let res=await axios.post('http://localhost:3000/upload',formData)
//    console.log(res.data)
// }
// async function getImages(){
//   let res= await axios.get('http://localhost:3000/uploads')
//   setImages(res.data.payload)
// }
const {register,handleSubmit,formState:{errors}}=useForm()
const {currentUser,setCurrentUser}=useContext(createObj)

function detailsOfpost(obj) {


  const d = new Date();

  // Add nested farmerData
  obj.farmerData = {
    nameOfFarmer: currentUser.firstName,
    email: currentUser.email,
    profileImageUrl: currentUser.profileImageUrl || ""
  };

  // Add nested reviewData
  obj.reviewData = {
    nameOfFarmer: currentUser.firstName,
    rating: currentUser.rating || 5,
    comment: currentUser.comment || "",
    profileImageUrl: currentUser.profileImageUrl || ""
  };

  obj.jobId = Date.now();
  obj.DateOfCreation = `${d.getDate()}_${d.getMonth() + 1}_${d.getFullYear()}_${d.toLocaleTimeString("en-US", { hour12: true })}`;
  obj.DateOfModification = obj.DateOfCreation;
  obj.isJobActive = true;

  axios
    .post("http://localhost:3000/farmer-api/job", obj)
    .then((res) => {
      if (res.status === 201) {
        nav(`/farmerprofile/${currentUser.email}/jobs`);
      }
    })
    .catch((err) => {
      console.log("Error while posting job:", err);
      alert("Something went wrong while submitting the job!");
    });
  }

  return (
    <div >
      <img src={image} width="100%" height="1000px"/>
  
  <div style={{position:"absolute",left:"30%",top:"45%"}}>
  
  <form onSubmit={handleSubmit(detailsOfpost)} className="form-control text-center " style={{backgroundColor:"transparent"}}>
    <h4 className="text-center text-white">Create a Post</h4>
    <div>
      <label htmlFor="title" className="text-white fs-5">Title:</label>
      <input
      placeholder='Enter a Title'
        type="text"
        id="title"
        name="title"
        className="m-3 w-50 text-white"
        style={{backgroundColor:"transparent",border:"solid 1px red"}}
        {...register('title', { required: "Enter correct details" })}
      />
      {errors.title && <p className="text-danger"> {errors.title.message}</p>}
    </div>
    <div>
      <label htmlFor="content" className="text-white fs-5">Content:</label>
      <input
        type="text"
        id="content"
        placeholder='Enter a content'
        name="content"
         className="m-3 w-50  text-white"
         style={{backgroundColor:"transparent",border:"solid 1px red"}}
        {...register('content', { required: "Enter valid details" })}
      />
      {errors.content && <p className="text-danger">{errors.content.message}</p>}
    </div>
    <div>
      <label htmlFor="wages" className="text-white fs-5">Wages:</label>
      <input
     
        type="number"
        id="wages"
         placeholder='enter wages(ruppes)'
        name="wages"
        min="100"
        max="100000"
        step="100"
        style={{backgroundColor:"transparent",border:"solid 1px red"}}
        {...register('wages', { required: "Enter positive numbers" })}
         className="m-3 w-50  text-white "
      />
      {errors.wages && <p className="text-danger">{errors.wages.message}</p>}
    </div>
    <div>
      <label htmlFor="fieldSize" className="text-white fs-5">FieldSize:</label>
      <input
        type="number"
        id="fieldSize"
        name="fieldSize"
        min="1"
        max="100"
        placeholder="How many acres of land"
         className="m-3 w-50  text-white"
         style={{backgroundColor:"transparent",border:"solid 1px red"}}
        {...register('fieldSize', { required: "FieldSize is required" })}
      />
      {errors.fieldSize && <p className="text-danger">{errors.fieldSize.message}</p>}
    </div>
    <div>
      <label htmlFor="startdate" className="text-white fs-5">StartDate:</label>
      <input
      placeholder="dd/mm/yy"
        type="date"
        id="startdate"
        name="startdate"
        min={date}
         className="m-3 w-50  text-white"
         style={{backgroundColor:"transparent",border:"solid 1px red"}}
        {...register('startDate', { required: "StartDate is required" })}
      />
      {errors.start && <p className="text-danger">{errors.start.message}</p>}
     
    </div>
    <div>
      <label htmlFor="enddate" className="text-white fs-5">EndDate:</label>
      <input
        type="date"
        id="enddate"
        name="enddate"
        min={date}
         className="m-3 w-50  text-white"
         style={{backgroundColor:"transparent",border:"solid 1px red"}}
        {...register('endDate', { required: "EndDate is required" })}
      />
      {errors.enddate && <p className="text-danger">{errors.enddate.message}</p>}
    </div>
    <div>
      <label htmlFor="location" className="text-white fs-5">Location:</label>
      <select
        id="location"
        name="location"
         className="m-3 w-50  text-white"
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
    
    <div>
      <label htmlFor="zipcode" className="text-white fs-5">ZipCode:</label>
      <input type="number" placeholder="XXXXXX"  id="zipcode" name="zipcode" min="100000" max="999999" {...register('zipcode',{required:"must have 6-digits"})} className="m-3 w-50  text-white" style={{backgroundColor:"transparent",border:"solid 1px red"}}/>
      {errors.zipcode && <p className="text-danger">{errors.zipcode.message}</p>}
    </div>
    <div>
      <label htmlFor="timings" className="text-white fs-5">
        Timings:
      </label>
      <select id="Timings" {...register('Timings',{required:"timings are required"})} className="m-3 w-50  text-white" style={{backgroundColor:"transparent",border:"solid 1px red"}}>
        <option value="select">Select a option</option>
        <option value="8 A.M.-5 P.M.">8 A.M.-5 P.M. </option>
        <option value="10 A.M.-5P.M.">10 A.M.-5P.M. </option>
      </select>
    </div>

    <button type="submit" className="btn btn-success" >Post</button>
  </form>
  </div>
</div>

  )
}

export default CreatePost


    {/* <div>
      <label htmlFor="images" className="text-white fs-5">Upload Crop Image:</label>
      <input type="file" id="images" {...register('images',{required:'must upload image'}) } onChange={change} />
      <button onClick={submit}>upload</button>
    </div> */}

    {/* <div>
      <label htmlFor="fieldImage" className="text-white fs-5">Field Image:</label>
      <input type="file" id="fieldImage" onChange={change} name="fieldImage" {...register('fieldImage',{required:"field image is required"})} className="m-3 w-50  text-white"
         style={{backgroundColor:"transparent",border:"solid 1px red"}}/>
      {errors.fieldimage && <p className="text-danger">{errors.fieldimage.message}</p>}
    </div> */}