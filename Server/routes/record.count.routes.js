const express=require("express")
const recordRouter=express.Router();
const { CountVisitor,CountStaff,visitorData,staffData,deletevisitors,deleteStaff} =require('../controllers/Record.AdminPannel')


recordRouter.get("/numberofvisitor",CountVisitor);
recordRouter.get("/numberofstaff",CountStaff);
recordRouter.get("/visitordata",visitorData);
recordRouter.get("/staffdata",staffData);
recordRouter.delete("/deletevisitors",deletevisitors);
recordRouter.delete("/deletestaff/:id",deleteStaff);

module.exports=recordRouter;