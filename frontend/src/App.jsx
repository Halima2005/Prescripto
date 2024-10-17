import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import About from './pages/About'
import Appointment from './pages/Appointment'
import Contact from './pages/Contact'
import Doctor from './pages/Doctor'
import Home from './pages/Home'
import Login from './pages/Login'
import MyAppointment from './pages/MyAppointment'
import MyProfile from './pages/MyProfile'
import VerifyPayment from './pages/verify'


const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]"> 
    <ToastContainer />
    <Navbar/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/doctors' element={<Doctor/>}/>
      <Route path='/doctors/:speciality' element={<Doctor/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/my-profile' element={<MyProfile/>}/>
      <Route path='/my-appointment' element={<MyAppointment/>}/>
      <Route path='/appointment/:docId' element={<Appointment/>}/>
      <Route path='/verifypayment/:appointmentId' element={<VerifyPayment/>}/>
      
    </Routes>
    <Footer/>
   </div>
  )
}

export default App

//MONGOODB_URL ='mongodb+srv://halimayasmin6579:SCgT7oYv1QJ5hqQ8@cluster0.afnbe.mongodb.net'
//CLOUDINARY_NAME ='de9blmcja'
//CLOUDINARY_API_KEY ='419752713416365'
//CLOUDINARY_SECRET_KEY ='Ow4nu4S2OaEJ9Zjrcd_72JEqMCM'