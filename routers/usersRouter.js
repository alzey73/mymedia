const express=require("express");
const router=express.Router();
const usersController=require("../controllers/usersControllers");

router.get("/",usersController.listUsers);

router.post("/",usersController.createUser);

router.post("/login",usersController.login);




module.exports=router;