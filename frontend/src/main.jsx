import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.css'
import './i18n'
import './ui.css'
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
import Approve from './components/farmer/Approve.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'
import MyJobs from './components/farmer/MyJobs.jsx'
import AllJobs from './components/farmer/AllJobs.jsx'
import FarmerSettings from './components/farmer/FarmerSettings.jsx'
import FarmerComingSoon from './components/farmer/FarmerComingSoon.jsx'
import FarmerDashboard from './components/farmer/FarmerDashboard.jsx'
import MyApplications from './components/labour/MyApplications.jsx'
import AdminDashboard from './components/admin/AdminDashboard.jsx'
import HiredWorkers from './components/farmer/HiredWorkers.jsx'
import JobHistory from './components/labour/JobHistory.jsx'
import LabourSettings from './components/labour/LabourSettings.jsx'
import LabourDashboard from './components/labour/LabourDashboard.jsx'
const browserObj=createBrowserRouter([
  {
    path:'/signin',
    element:<Signin/>
  },
  {
    path:'/signup',
    element:<SignUp/>
  },
  {
    path:'/',
    element:<RootLayout/>,
    children:[
      {
          path:'',
          element:<Home/>
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
        element:<ProtectedRoute allowedRoles={['farmer']} />,
        children:[{
          path:'farmerprofile/:email',
          element:<FarmerProfile/>,
          children:[
            { path:'', element:<FarmerDashboard/> },
            { path:'jobs', element:<Jobs/> },
            { path:'createpost', element:<CreatePost/> },
            { path:':jobId', element:<JobById/> },
            { path:'app', element:<Applications/> },
            { path:'hired', element:<HiredWorkers/> },
            { path:'approve', element:<Approve/> },
            { path:'myjobs', element:<MyJobs/> },
            { path:'alljobs', element:<AllJobs/> },
            { path:'settings', element:<FarmerSettings/> },
            {
              path:'messages',
              element:(
                <FarmerComingSoon
                  title="Messages"
                  description="Chat with labourers and manage conversations in one place."
                />
              ),
            },
            {
              path:'payments',
              element:(
                <FarmerComingSoon
                  title="Payments"
                  description="Track wages, invoices, and payment history for your farm jobs."
                />
              ),
            },
          ]
        }]
      },
      {
        element:<ProtectedRoute allowedRoles={['labour']} />,
        children:[{
          path:'labourprofile/:email',
          element:<LabourProfile/>,
          children:[
            { path:'', element:<LabourDashboard/> },
            { path:'settings', element:<LabourSettings/> },
            { path:'me', element:<Navigate to="settings" replace /> },
            { path:'jobs', element:<Jobs/> },
            { path:'apply', element:<ApplyJob/> },
            { path:':jobId', element:<JobById/> },
            { path:'app', element:<Applications/> },
            { path:'myapplications', element:<MyApplications/> },
            { path:'history', element:<JobHistory/> },
            {
              path:'messages',
              element:(
                <FarmerComingSoon
                  title="Messages"
                  description="Chat with farmers and manage your conversations."
                />
              ),
            },
            {
              path:'payments',
              element:(
                <FarmerComingSoon
                  title="Payments"
                  description="View earnings and payment history for completed jobs."
                />
              ),
            },
          ]
        }]
      }
      ,
      {
        element:<ProtectedRoute allowedRoles={['admin']} />,
        children:[{
          path:'admin',
          element:<AdminDashboard/>
        }]
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <FarmerLabourContext>
    <StrictMode>
      <RouterProvider router={browserObj}/>
    </StrictMode>
  </FarmerLabourContext>
)
