import axios from 'axios';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const VerifyPayment = () => {
  const [searchParams] = useSearchParams();
  
  const success = searchParams.get('success');  // Get 'success' param from URL
  const appointmentId = searchParams.get('appointmentId');  // Get 'appointmentId' param from URL

  useEffect(() => {
    console.log(`Success param: ${success}, Appointment ID: ${appointmentId}`);  // Debug log

    const verifyPayment = async () => {
      if (appointmentId && success !== null) {
        try {
          const res = await axios.post('/api/verify-payment', {
            appointmentId,
            success,
          });
          
          if (res.data.success) {
            console.log('Payment verified, appointment booked.');
          } else {
            console.log('Payment failed or appointment cancelled.');
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
        }
      } else {
        console.error("Missing success or appointmentId parameters.");
      }
    };

    verifyPayment();
  }, [appointmentId, success]);

  return <div>Verifying Payment...</div>;
};

export default VerifyPayment;
