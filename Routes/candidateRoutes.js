const express=require("express");
const router=express.Router();
const Candidate=require("./../Models/candidate.js");
const User = require("../Models/user.js");
const {jwtAuthMiddleware,generateToken}=require("./../jwt.js");
const { name } = require("body-parser");

// Function to check role as admin
const checkAdmin = async (userID) => {
    const user = await User.findById(userID);

    if (user.role === "admin") {
        return true;
    } else {
        return false;
    }
}

// Endpoint for Adding new candidate
router.post("/",jwtAuthMiddleware, async (req, res) => {
    try {
        const isAdmin = await checkAdmin(req.user.user.id); // Wait for the checkAdmin function to resolve

        if (!isAdmin) {
            return res.status(403).json({ message: "User Does not have admin role" });
        }

        const newCandidateData = req.body;
        const newCandidate = new Candidate(newCandidateData);
        const response = await newCandidate.save();

        console.log("New Candidate added successfully");
        res.status(201).json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add new candidate" });
    }
});


// Endpoint for upadting candidate
router.put("/:candidateId",jwtAuthMiddleware,async (req,res)=>{
    try { 
        const isAdmin = await checkAdmin(req.user.user.id); // Wait for the checkAdmin function to resolve

        if (!isAdmin) {
            return res.status(403).json({ message: "User Does not have admin role" });
        }

        const candidateId=req.params.candidateId;   
        console.log(candidateId); //extracting id from the token
        const updatedData=req.body; // Extracting updated data from the body
       
        // Find the user existence
        const response=await Candidate.findByIdAndUpdate(candidateId,updatedData,{
            new:true, // Return the updated document
            runValidators:true // Run the validation on the updated document
        });
        if(!response){
            return res.status(404).json({message:"Candidate not found"});
        }
        console.log("Candidate data updated sucessfully");
        res.status(200).json(response);
        
        
    } catch (error) {
        console.log( "Error while fetching data",error);
        res.status(500).send({ message: "Internal Server Error" });
    }
})


// router for delete candidate
router.delete("/:candidateId",jwtAuthMiddleware,async (req,res)=>{
    try {
        const isAdmin = await checkAdmin(req.user.user.id); // Wait for the checkAdmin function to resolve

        if (!isAdmin) {
            return res.status(403).json({ message: "User Does not have admin role" });
        }

        const candidateId=req.params.candidateId;
        // Find the user existence
        const response = await Candidate.findByIdAndDelete(candidateId);
        if(!response){
            return res.status(404).json({message:"Candidate not found"});
        }
        console.log("Candidate deleted sucessfully");
        res.status(200).json(response);


    } catch (error) {
        console.log( "Error while fetching data",error);
        res.status(500).send({ message: "Internal Server Error" });
    }

});



//Route for voting a candidate
router.post("/vote/:candidateId",jwtAuthMiddleware,async (req,res)=>{
    try {
        const userId=req.user.user.id;
        const candidateId=req.params.candidateId;

        //Check user is available or not
        const user=await User.findById(userId);
        if(!user) return res.status(404).json({message:"User Not found"});

        //Check candidate is availabe or not
        const candidate=await Candidate.findById(candidateId);
        if(!candidate) return res.status(404).json({message:"Candidate not found"});

        //Checking is user alredy voted
        if(user.isVoted) return res.status(400).json({message:"User already voted"});

        //Checkin is user is admin
        if(user.role=="admin") return res.status(403).json({message:"Admin cannot vote"});

        candidate.votes.push({user:userId})
        candidate.totalVotes++;
        await candidate.save();

        user.isVoted=true;
        await user.save();
    
        return res.status(200).json({message:"Vote Recorded Sucessfully"});



    } catch (error) {
        console.log( "Error while fetching data",error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


//Route ot see the vote count of candidates
router.get("/vote/count", async(req,res)=>{
    try {
        // finding all candidates data in decending order
        const candidates= await Candidate.find().sort({totalVotes:"desc"});

        const records= candidates.map((data)=>{
            return{
                name:data.name,
                party:data.party,
                totalVotes:data.totalVotes
            };
        })

        res.status(200).json(records);
    } catch (error) {
        console.log( "Error while fetching data",error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

// Get List of all candidates with only name and party fields
router.get('/', async (req, res) => {
    try {
        // Find all candidates and select only the name and party fields, excluding _id
        const candidates = await Candidate.find({}, 'name party -_id');

        // Return the list of candidates
        res.status(200).json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports=router;