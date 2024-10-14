import express from "express";
import multer from 'multer';
import { addDoctor, allDoctors, loginAdmin } from "../controllers/adminController.js";
import { changeAvailability } from "../controllers/doctorController.js";
import authAdmin from "../middlewares/authAdmin.js";
import upload from "../middlewares/multer.js";
const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailability)


const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});


export default adminRouter