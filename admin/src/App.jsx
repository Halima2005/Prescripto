import React, { useContext } from 'react';

import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import { AdminContext } from './context/AdminContext.jsx';
import AddDoctor from './pages/Admin/AddDoctor.jsx';
import AllApointment from './pages/Admin/AllApointment.jsx';
import Dashboard from './pages/Admin/Dashboard.jsx';
import DoctorList from './pages/Admin/DoctorList.jsx';
import Login from './pages/Login.jsx';




const App = () => {

const {aToken} = useContext(AdminContext)


  return aToken ? (
    <div className='bg-[#F8F9FD]' >
       
       <ToastContainer/>
       <Navbar/>
       <div className='flex items-start'>
          <Sidebar/>
          <Routes>
            <Route path='/' element={<></>} />
            <Route path='/admin-dashboard' element={<Dashboard/>} />
            <Route path='/all-appointment' element={<AllApointment/>} />
            <Route path='/add-doctor' element={<AddDoctor />} />
            <Route path='/doctor-list' element={<DoctorList/>} />
          </Routes>
       </div>
      
    </div>
  ):(
    <>
     <Login/>
     <ToastContainer/>
    </>
  )
}

export default App