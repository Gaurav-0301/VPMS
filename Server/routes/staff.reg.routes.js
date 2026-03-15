const express=require("express")
const regRouter=express.Router();
const createStaff=require('../controllers/Staff.registration')

regRouter.post("/staff/register",createStaff);

module.exports=regRouter;