const express=require("express")
const recordRouter=express.Router();
const { CountVisitor,CountStaff,visitorData,staffData} =require('../controllers/Record.AdminPannel')


recordRouter.get("/numberofvisitor",CountVisitor);
recordRouter.get("/numberofstaff",CountStaff);
recordRouter.get("/visitordata",visitorData);
recordRouter.get("/staffdata",staffData);

module.exports=recordRouter;