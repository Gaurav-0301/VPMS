const express=require("express");
const { createRegistration, registrationStatus } = require("../controllers/registration.user");
const router=express.Router();

router.post("/register",createRegistration);
router.get("/status/:number",registrationStatus);

module.exports=router;