const express=require("express");
const router=express.Router();
const User=require("../Models/user.js");
const {jwtAuthMiddleware,generateToken}=require("../jwt.js")

// Endpoint for user signup
router.post("/signup", async (req,res)=>{
    try {
        const userData = req.body;    //assuming body contains the data

        const newUser = new User(userData); //creating new person with data
        console.log(newUser);
        
        const result = await newUser.save(); //saving the person to the database
        console.log("Data is saved sucessfully");
       
        const payload={
            id:result.id
        }
        const token=generateToken(payload);
        console.log("Token is:",token);

        res.status(200).json({response:result,token:token});

    } catch (error) {
        console.log("Error while saving data", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
})


//Endpoint for user login
router.post("/login", async(req,res)=>{
    try {
        // Extract username and password
        const {aadharCardNumber,password}=req.body;

        // Find the user exist
        const user=await User.findOne({aadharCardNumber:aadharCardNumber});

        // if user not found and pwd not match
        if(!user || !await user.comparePassword(password)){
            return res.status(401).send({message:"Invalid username or password"});
        }

        //Geneeate Token
        const payload={
            id:user.id
        }
        const token=generateToken(payload);
        res.status(200).json({token:token});
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
})


// Endpoint for acessing profile
router.get("/profile",jwtAuthMiddleware,async(req,res)=>{
    try {
        const userData=req.user.user;
        const user = await User.findById(userData.id);
        res.status(200).json(user);
        
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
})


// Endpoint for changing passsword
router.put("/profile/password",jwtAuthMiddleware,async (req,res)=>{
    try { 
        const userId=req.user.user;                          //extracting id from the token
        const {currentPassword,newPassword}=req.body;        //extracting current password and new password from request
       
        // Find the user existence
        const user=await User.findById(userId);
        // checking password is coreect or not
        if(!(await user.comparePassword(currentPassword))){
            return res.status(401).send({message:"Invalid current password"});
        }
        //Allowing updating password
        user.password=newPassword;
        await user.save();
        res.status(200).json({message:"Password updated successfully"});
        
    } catch (error) {
        console.log( "Error while fetching data",error);
        res.status(500).send({ message: "Internal Server Error" });
    }
})


module.exports=router;