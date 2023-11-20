const express=require("express");
const router=express.Router();
const TCMBController=require("../controllers/TCMBController");

router.get("/",TCMBController.getTCMB);

//router.post("/",usersController.createUser);

//router.post("/login",usersController.login);




module.exports=router;