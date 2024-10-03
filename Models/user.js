const mongoose=require("mongoose");

//creating user schema
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String
    },
    mobile:{
        type:String
    },
    address:{
        type:String,
        required:true
    },
    aadharCardNumber:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    role:{
        type:String,
        enum:["admin","voter"],
        default:"voter"
    },
    isVoted:{
        type:Boolean,
        default:false
    },

});

const user=mongoose.model("user",userSchema);
module.exports=user;