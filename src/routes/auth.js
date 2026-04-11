const express = require('express')
const authRouter = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const {validateSignUpData} = require('../utils/validator')
const {userAuth} = require('../middlewares/auth')


// Signing Up an account

authRouter.post("/signup", async (req,res)=>{
    
    // Creating a  new instance of te User model
    // const user = new User(req.body)
    try {

         validateSignUpData(req)

         const{emailId} = req.body
        const existingUser = await User.findOne({emailId})

        if(existingUser){
             return res.status(400).send("Email already exits")

        }
        
        const allowedFields = ["firstName","lastName","emailId","password","age","gender","photoUrl","about","skills"];

        const data = {};
        Object.keys(req.body).forEach((key) => {
          if (allowedFields.includes(key)) {
            data[key] = req.body[key];
          }
        });

        // skills validation
        if (data.skills) {
          if (!Array.isArray(data.skills)) {
            return res.status(400).send("Skills must be an array");
          }

          data.skills = data.skills.map(skill =>
            skill.trim().toLowerCase()
          );

          data.skills = [...new Set(data.skills)];

          if (data.skills.length > 10) {
            return res.status(400).send("Max 10 skills allowed");
          }
        }

        // Password Hashing
        
        const passwordHash = await bcrypt.hash(data.password,10)
        data.password = passwordHash;
         const user = new User(data);
 
      await  user.save()
        res.send("User Added Successfully")
        
    } catch (err) {
        res.status(400).send("Error saving the User" + err.message)
        
    }

})


// Login User after Successfully SignUp
authRouter.post("/login", async(req,res)=>{

    try {

        const {emailId, password} = req.body;

     const user = await User.findOne({emailId})

     if(!user){
       throw new Error("Invalid Credentials")
     }
     
    //  const isValidPassword = await bcrypt.compare(password, user.password)

    const isValidPassword = await user.validatePassword(password)

          if(!isValidPassword){
            // res.send("Login Successfull")
            throw new Error("Invalid Credentials")
          }

          const token = await user.getJWT()

            // const token = jwt.sign({_id:user._id}, "SECRET_KEY", {expiresIn:"1d"})

            res.cookie("token", token)
            res.send("Login Successful")


        
    } catch (error) {
          res.status(400).send("Error in login the User" + error.message)    
    }
     
})

authRouter.post("/logout", async(req,res)=>{
    try {

        res.clearCookie("token");   //1st way

        res.cookie("token", null , {expires: new Date(Date.now())}) //2nd way
        res.send("Logout Successfull")
        
    } catch (error) {
        res.status(400).send("Error in logout " + error.message);
    }
})


module.exports = authRouter ;