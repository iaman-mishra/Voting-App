const jwt=require("jsonwebtoken");

const jwtAuthMiddleware=(req,res,next)=>{

    //first check header has authorization or not
    const authorization=req.headers.authorization;
    if(!authorization){
        return res.status(401).json({error:"Token not found"});
    }

    //Extracting jwt token from request header
    const token = req.headers.authorization.split(" ")[1];
    if(!token) return res.status(401).json({error:"Unathorized"});

    try{
        //verift the jwt token
        const decoded=jwt.verify(token, process.env.JWT_SERCRET);

        //Attach user information to requested object
        req.user=decoded;
        next();

    }catch(err){
        console.error(err);
        res.status(401).json({error:"Invalid Token"});
    }
}

//Function to genrate token
const generateToken=(user)=>{
    return jwt.sign({user},process.env.JWT_SERCRET,{expiresIn:"30m"});
}

module.exports={jwtAuthMiddleware,generateToken};