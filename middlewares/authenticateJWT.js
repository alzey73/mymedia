const jwt = require('jsonwebtoken');

function authenticateJWT(req,res,next){
    //const token = req.header("Authorization").split(' ')[1];
    const token = req.header("x-auth-token");

    const secretKey = process.env.SECRET_KEY;
   


    if (!token){
        return res.status(401).send("Access denied. No token provided.");        
    }

    jwt.verify(token,secretKey,(err,decoded)=>{
        if (err){
            console.error(err);
            return res.sendStatus(403);
        }
       req.user=decoded;
    //    console.log("Decoded JWT:", req.user);
        next();
    });
}

module.exports = authenticateJWT;
