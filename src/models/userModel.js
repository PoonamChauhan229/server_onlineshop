const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3,
        maxlength:30
    },
    email:{
        type:String,
        required:true,
        minlength:3,
        maxlength:200,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:3,
        maxlength:1024,
        unique:true
    }
})


// Generate the Token:
userSchema.methods.generateAuthToken = async function() {
    const secretKey = process.env.JWT_SECRET_KEY;
    const user = this;
    
    // Generate the token
    const token = jwt.sign({ _id: user._id.toString() }, secretKey);
    
    // Token generated, add to the tokens array in usermodel
    //user.tokens = user.tokens.concat({ token });
    
    // Save the user to the database
    await user.save();
    
    return token;
}



const User=mongoose.model('User',userSchema)
module.exports=User;
