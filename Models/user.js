const mongoose=require("mongoose");
const bcrypt = require("bcrypt");  // Corrected the import

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


// Pre-save hook to hash password before saving to database
userSchema.pre("save", async function (next) {
    const curr = this;
    
    // Check if the password has been modified
    if (!curr.isModified("password")) return next();

    try {
        // Generate salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password with the salt
        const hashedPWD = await bcrypt.hash(curr.password, salt);

        // Override the current password with the hashed password
        curr.password = hashedPWD;

        next();
    } catch (error) {
        return next(error);
    }
});

// Method to compare entered password with stored hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        // Use await since bcrypt.compare returns a Promise
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};
const User=mongoose.model("User",userSchema);
module.exports=User;