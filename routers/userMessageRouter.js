const express=require("express");
const router=express.Router();


const authenticateJWT = require('../middlewares/authenticateJWT');
const userMessagesController=require("../controllers/userMessagesController")


router.get("/", authenticateJWT, userMessagesController.getUserMessages);

module.exports=router;