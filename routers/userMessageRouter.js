const express=require("express");
const router=express.Router();


const authenticateJWT = require('../middlewares/authenticateJWT');
const userMessagesController=require("../controllers/userMessagesController")


router.get("/", authenticateJWT, userMessagesController.getUserMessages);
router.post("/send",authenticateJWT,userMessagesController.sendMessages);

module.exports=router;