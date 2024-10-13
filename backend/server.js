import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import connectCloudinary from './config/cloudinary.js'
import connectDB from './config/mongodb.js'
import adminRouter from './routes/adminRoute.js'

//app config
const app = express()
   // Example to set timeout for the route
   app.use((req, res, next) => {
    req.setTimeout(500000); // Increase to a higher value if necessary
    next();
 });

const port = process.env.PORT || 4000
connectDB()
connectCloudinary()


// middlewares
app.use(express.json())
app.use(cors())

//app endpoints
app.use('/api/admin',adminRouter)
// localhost:4000/api/admin/add-doctor


app.get('/',(req,res)=>{
    res.send('API WORKING')
})

app.listen(port,()=>console.log("Server Started",port))
