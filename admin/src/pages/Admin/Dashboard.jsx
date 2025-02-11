import React, { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {


const {aToken,  dashData,getDashData, cancelAppointment }  = useContext(AdminContext)


const { slotDateFormat } = useContext(AppContext)
useEffect(()=>{
    if(aToken){
      getDashData()
    }
},[aToken])


  return dashData &&(
    <div className='mt-5'>
      <div className='flex flex-wrap gap-3'>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border border-[#DADADA] border-gray-200 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.doctor_icon} alt="" />

          <div>

            <p className='text-xl font-semibold text-gray-800'>{dashData.doctors}</p>
            <p className='text-gray-400'>Doctors</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border border-[#DADADA] border-gray-200 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />

          <div>

            <p className='text-xl font-semibold text-gray-800'>{dashData.appointments}</p>
            <p  className='text-gray-400'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border border-[#DADADA] border-gray-200 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />

          <div>

            <p className='text-xl font-semibold text-gray-800'>{dashData.patients}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>

      <div className='bg-white'>

        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border border-[#DADADA] border-gray-200'>
          <img  src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Booking</p>

        </div>
        <div className='pt-4 border border-[#DADADA]'>
          {
            dashData.letestAppointments.map((item,index) => (
              <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                  <img className='rounded-full w-10' src={item.docData.image} alt="" />
                  <div className='flex-1 text-sm'>
                    <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                    <p className='text-gray-800'>{slotDateFormat(item.slotDate)}</p>
                  </div>
                  {item.cancelled 
               ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
              : <img onClick={()=> cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
              }
              </div>
            )
             
            )

          }
        </div>
      </div>
    </div>
  )
}

export default Dashboard