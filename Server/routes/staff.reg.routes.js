const express=require("express")
const regRouter=express.Router();
const {createStaff,loginStaff,logoutStaff}=require('../controllers/Staff.registration')

regRouter.post("/staff/register",createStaff);
regRouter.post("/staff/login",loginStaff);
regRouter.post("/staff/login",logoutStaff);

module.exports=regRouter;