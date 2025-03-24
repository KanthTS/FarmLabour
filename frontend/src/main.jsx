import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.css'
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom'
import RootLayout from './RootLayout.jsx'
import Home from './components/common/Home.jsx'
import Signin from './components/common/SignIn.jsx'
import SignUp from './components/common/SignUp.jsx'
import Howitworks from './components/common/Howitworks.jsx'
// import JobListings from './components/common/JobListing.jsx'
import About from './components/common/About.jsx'
import FarmerProfile from './components/farmer/FarmerProfile.jsx'
import Jobs from './components/common/Jobs.jsx'
import CreatePost from './components/farmer/CreatePost.jsx'
import JobById from './components/common/JobById.jsx'
import LabourProfile from './components/labour/LabourProfile.jsx'
import FarmerLabourContext from './components/contexts/FarmerLabourContext.jsx'
import ApplyJob from './components/labour/ApplyJob.jsx'
import Applications from './components/common/Applications.jsx'
const browserObj=createBrowserRouter([
  {
    path:'/',
    element:<RootLayout/>,
    children:[
      {
          path:'',
          element:<Home/>
      },
      {
         path:'signin',
         element:<Signin/>
      },
      {
          path:'signup',
          element:<SignUp/>
      },
      {
        path:'howitworks',
        element:<Howitworks/>
      },
      // {
      //   path:'/joblistings',
      //   element:<JobListings/>
      // },
      {
        path:'about',
        element:<About/>
      },
      {
        path:'farmerprofile/:email',
        element:<FarmerProfile/>,
        children:[
          {
            path:'jobs',
            element:<Jobs/>
          },
          {
            path:'createpost',
            element:<CreatePost/>
          },
          {
            path:':jobId',
            element:<JobById/>
          },
          {
            path:'app',
            element:<Applications/>
          },
          {
            path:'',
            element:<Navigate to='jobs'/>
          }
        ]
      },
      {
        path:'labourprofile/:email',
        element:<LabourProfile/>,
        children:[
          {
            path:'jobs',
            element:<Jobs/>
          },
          
            {
              path:':jobId',
              element:<JobById/>
            },
            {
              path:'apply',
              element:<ApplyJob/>
            },
            {
              path:'app',
              element:<Applications/>
            },
            {
              path:'',
              element:<Navigate to='jobs'/>
            }
          
        ]
      }
   
  ]
  }
])

createRoot(document.getElementById('root')).render(
  <FarmerLabourContext>
    <StrictMode>
    <RouterProvider router={browserObj}/>

  </StrictMode>,
  </FarmerLabourContext>
)
