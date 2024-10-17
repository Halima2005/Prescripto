import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Verify = () => {
  const VITE_BACKEND_URL ='http://localhost:4001'
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  
  const navigate = useNavigate();
  const verifyPayment = async () => {
    const response = await axios.post(VITE_BACKEND_URL+"/api/user/verify-appointment-payment",{success,orderId});
    if(response.data.success){
        navigate("/my-appointment");
    }
    else{
      navigate("/")
    }
  }
  
  useEffect(()=>{
    verifyPayment();
  },[])




  return (
    <div className='verify'>
      <div className='spinner'></div>
     
    </div>
  );
};

export default Verify;
