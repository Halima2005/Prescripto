import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import jwt from 'jsonwebtoken'
import Stripe from "stripe"
import validator from 'validator'
import appointmentModel from '../models/appointmentModel.js'
import doctorModel from '../models/doctorModel.js'
import userModel from '../models/userModel.js'
//API TO REGISTER USER
const registerUser = async(req,res) =>{
    try{

        const { name, email, password } = req.body

        if( !name || !password || !email ){
            return res.json({success:false,message:"Missing Details"})
        }
        //validating email format
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"enter a valid email"})
        }
        //validating strong password
        if(password.length < 8){
            return res.json({success:false,message:"enter a strong password"})
        }


        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const userData = {
            name,
            email,
            password : hashedPassword
        }


        const newUser = new userModel(userData)
        const user = await newUser.save()
        
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET )

        res.json({success:true,token})

    }catch(error){
         console.log(error)
        res.json({success:false,message: error.message})
        
    }
}


//API for user login

const loginUser = async(req,res)=>{
    try{
        const {email,password} = req.body
        const user = await userModel.findOne({email})

        if(!user){
           return res.json({success:false,message: "user does not exist"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(isMatch){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            res.json({success:false,message:"Invalid credentails"})
        }

    }catch(error){
        console.log(error)
        res.json({success:false,message: error.message})
    }
}


// API to get user profile data
const getProfile = async(req,res)=>{
    try{

        const {userId} = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({success:true,userData})

    }catch(error){
        console.log(error)
        res.json({success:false,message: error.message})
    }
}

// API to update user Profile

const updateProfile = async(req,res) => {

    try{




        const { userId, name, phone, address, dob,gender } = req.body

        const imageFile = req.file

        if(!name || !phone || !dob || !gender){
            return res.json({success:false,message:"Data Missing"})

        }

        await userModel.findByIdAndUpdate(userId, {name, phone, address:JSON.parse(address),dob,gender})

        if(imageFile){
            //upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:'image'})

            const imageUrl = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, {image:imageUrl})
        }

        res.json({success:true,message:"Profile Updated"})

    }catch(error){
        console.log(error)
        res.json({success:false,message: error.message})
    }
}

//API to book Appointment

const bookAppointment = async (req,res) =>{
    try{


        const { userId, docId, slotDate, slotTime} = req.body

        const docData = await doctorModel.findById(docId).select('-password')

        if(!docData.available) {
            return res.json({success:false,message:'Doctor not available'})
        }

        let slots_booked = docData.slots_booked

        //checking for slot availability
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false,message:'Slots not available'})
            }else{
                slots_booked[slotDate].push(slotTime)
            }
        } else{
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }


        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount:docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
            cancelled: false // Add this line
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData

        await  doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:'Appointment Booked'})

    } catch(error){
        console.log(error)
        res.json({success:false,message: error.message})
    }
}
// API to get user appointments for frontend my appointments page


const listAppointment = async (req, res) => {
    try {
        const { userId } = req.body;  // Or decode from token if you're using JWT
        if (!userId) {
            return res.json({ success: false, message: "User ID is required" })
        }
        const appointments = await appointmentModel.find( { userId} )
        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to cancel appointment
const cancelAppointment = async(req,res) => {
    try{

        const {userId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user
        if(appointmentData.userId !== userId )
        {
            return res.json({success:false,message:"Unauthorized action"})

        }

        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})

        // release doctor slot

        const {docId, slotDate, slotTime} = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e=>e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, {slots_booked})

        res.json({success:true,message:'Appointment Cancelled'})

    }catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const paymentStripepay = async (req, res) => {
    const frontend_url = "http://localhost:5173"; // Frontend URL
  
    try {
      const { appointmentId } = req.body;
      const appointmentData = await appointmentModel.findById(appointmentId);
  
      
  
      const doctorData = await doctorModel.findById(appointmentData.docId);
  
      // Prepare Stripe line item for the appointment fee
      const line_items = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Appointment with Dr. ${doctorData.name}`
            },
            unit_amount: doctorData.fees * 100, // Stripe expects amounts in cents
          },
          quantity: 1
        }
      ];
  
      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: `${frontend_url}/verify?success=true&appointmentId=${appointmentId}`,
        cancel_url: `${frontend_url}/verify?success=false&appointmentId=${appointmentId}`,
        metadata: {
          appointmentId,
        },
      });
      
      // Send session URL to frontend
      res.json({ success: true, session_url: session.url });
      console.log(appointmentId);
  
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error creating payment session" });
    }
  };
  

// API to verify payment
// Assuming you are using Mongoose and have an Appointment model


// API handler
// Backend: Assuming you are using Express.js and MongoDB/Mongoose

// Make sure this path is correct

const verifyAppointmentPayment = async (req, res) => {
    try {
      const { appointmentId, success } = req.body; // Ensure these are correctly received
  
      if (!appointmentId || success === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      if (success === "true") {  // Ensure success is string type if passed in query params
        // Update the payment status to true immediately after payment success
        const appointment = await appointmentModel.findByIdAndUpdate(
          appointmentId,
          { payment: true },
          { new: true } // Return the updated document
        );
  
        if (!appointment) {
          return res.status(404).json({ error: 'Appointment not found' });
        }
  
        return res.status(200).json({ message: 'Payment updated successfully', appointment });
      } else {
        return res.status(400).json({ error: 'Payment failed' });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      return res.status(500).json({ error: 'Server error' });
    } 
  };
  


  
export { bookAppointment, cancelAppointment, getProfile, listAppointment, loginUser, paymentStripepay, registerUser, updateProfile, verifyAppointmentPayment }

