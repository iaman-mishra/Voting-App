const mongoose=require("mongoose");

//creating user schema
const candidateSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    party:{
        type:String,
        required:true,
        unique:true
    },
    age:{
        type:Number,
        required:true
    },
    votes:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                require:true
            },
            votedAt:{
                type:Date,
                default:Date.now
            }
        }
    ],
    totalVotes:{
        type:Number,
        default:0
    }
    
})

const candidate=mongoose.model("candidate",candidateSchema);
module.exports=candidate;