const express = require('express');
const app = express(); 
const db= require('./db');
const bodyParser = require('body-parser');      // Importing Body Parser
app.use(bodyParser.json());                     // using body parser
require("dotenv").config();


//------------------------------------------------------Defining server endpoints------------------------------------------------------

app.get("/",(req,res)=>{ res.send("Welcome to home page") }); 

// Import Routers file 
const userRoutes=require("./Routes/userRoutes");
const candidateRoutes=require("./Routes/candidateRoutes");

// Use Router file
app.use("/user",userRoutes);
app.use("/candidates",candidateRoutes);


const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("listening to port:3000");
    
}); 