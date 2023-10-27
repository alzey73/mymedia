const express=require("express");
const app=express();
const cors = require('cors');
require('dotenv').config();
const {connectDB} =require("./configs/db");
const mongoose = require("mongoose");

const usersRouter=require("./routers/usersRouter");
const userPagesRouter=require("./routers/userPagesRouter");

const PORT=process.env.PORT ||3000;

app.use(cors());
connectDB();

app.use(express.json());

app.use("/api/users",usersRouter);
app.use("/api/userpages",userPagesRouter);


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

