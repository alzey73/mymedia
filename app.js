const express=require("express");
const app=express();
const cors = require('cors');
require('dotenv').config();
const {connectDB} =require("./configs/db");
const mongoose = require("mongoose");
const http=require("http");
const server=http.createServer(app);
const initializeSockets=require("./configs/socketConfig");


const usersRouter=require("./routers/usersRouter");
const userPagesRouter=require("./routers/userPagesRouter");
const userMessageRouter=require("./routers/userMessageRouter");

const PORT=process.env.PORT ||3000;
const PORT2=process.env.PORT2 ||4000;

const io=initializeSockets(server);

app.use(cors());
connectDB();

app.use(express.json());

app.use('/public', express.static('public'));


app.use("/api/users",usersRouter);
app.use("/api/userpages",userPagesRouter);
app.use("/api/messagepage",userMessageRouter);


server.listen(PORT,()=>{
    console.log(`Server (with socket.io) is running on port ${PORT}`);
})

// app.listen(PORT,()=>{
//     console.log(`Server is running on port ${PORT}`);
// })

