const express=require("express");
const router=express.Router();
const upload=require("../configs/multerConfig")

const authenticateJWT = require('../middlewares/authenticateJWT');
const userPagesController=require("../controllers/useragesController")


router.get("/userpage", authenticateJWT, userPagesController.getUserFiles);

router.post("/upload",authenticateJWT,upload.single("file"),userPagesController.userUpload);

module.exports=router;