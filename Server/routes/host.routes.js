const express=require("express")
const hostRouter=express.Router();
const updateStatus=require("../controllers/host.updateStatus")
hostRouter.put("/statusupdate/:id",updateStatus);


module.exports=hostRouter;