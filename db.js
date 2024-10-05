const mongoose =require("mongoose");
require("dotenv").config();

const mongoURL=process.env.MONGO_URL_LOCAL;
// const mongoURL=process.env.MONGO_URL;
mongoose.connect(mongoURL);

const db=mongoose.connection;
 
db.on("connected",()=>{
    console.log("connected to mongo");
})

db.on("disconnected",()=>{
    console.log("disconnected from mongo");
})

db.on("error",(err)=>{
    console.log("error connecting to mongo :"+err);
})
