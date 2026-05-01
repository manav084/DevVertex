const express = require("express")
connectDB =require('./config/database.js')
const app = express();
const User = require('./models/user')
const cookieParser = require('cookie-parser')
const cors = require('cors')

// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcrypt')
// const {validateSignUpData} = require('./utils/validator.js')

app.use(express.json())
app.use(express.static("public"))
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

const authRouter    =  require('./routes/auth.js')
const profileRouter =  require('./routes/profile.js')
const requestRouter =  require('./routes/requests.js');
const userRouter    =  require("./routes/user.js");

 app.use("/", authRouter);
 app.use("/", profileRouter);
 app.use("/", requestRouter);
 app.use("/", userRouter)
 
 



// Fetch a user by EmailID. if there are multiple  sane email id's it'll fetch only one 
app.get("/getuser", async (req,res)=> {
    const userEmail =  req.body.emailId ; 

   try {
      
    const user = await User.findOne({ emailId : userEmail})
    if(user){
    res.json({ message: "User fetched successfully", data: user })

}else{
     res.status(404).json({ message: "User not found" })
}


   } catch (error) {

res.status(400).json({ message: error.message })
   }


})

 // Fetch list of all users present in a database

app.get("/feed", async (req,res)=> {
    
    
    
    try {
        const users = await User.find({})

        if(users.length> 0){

            res.json({ message: "Feed fetched successfully", data: users })
        }else{
res.status(404).json({ message: "No users found" })
        }

        
    } catch (error) {

res.status(400).json({ message: error.message })


        
    }

})

// Delete user find by id and delete

app.delete("/user", async (req,res)=> {

      const deleteId = req.body.deleteId
    
      
      try {
        const user = await User.findByIdAndDelete(deleteId)
        if(user){
res.json({ message: "User deleted successfully" })
        }else{
            // res.status(404).send("User  already deleted or User does not created")
            res.status(404).json({ message: "User not found" })

        }
    } catch (error) {

res.status(400).json({ message: error.message })

    }
})


// Update the user using patch (patch just replace only  change part )

app.patch("/user/:userId", async (req,res)=>{
    // const userId = req.params?.userId 

    const {userId} = req.params
    const updatedData = req.body

    if (!userId) {
//   return res.status(400).send("UserId is required");
   return res.status(400).json({ message: "UserId is required" })

}


    const allowedUpdates = ["firstName","lastName","photoUrl","about","gender","age", "skills",
                       "experience", "role"]
    const keys = Object.keys(updatedData);

    const isAllowedUpdates = keys.every((k)=>{
        return allowedUpdates.includes(k)
    })

    if(!isAllowedUpdates){
    //   return   res.status(400).send("Updates not allowed")
   return res.status(400).json({ message: "Updates not allowed" })
    }

      

    try {

        if(updatedData.skills){
            if(!Array.isArray(updatedData.skills)){
                //    return res.status(400).send("Skills must be an array");
                return res.status(400).json({ message: "Skills must be an array" })
            }
        

        if(updatedData.skills.length > 10){
            throw new Error("Skills cannot be more than 10")

        }

          updatedData.skills = updatedData.skills.map(skill => skill.trim().toLowerCase())

          updatedData.skills = [...new Set(updatedData.skills)]


    }
         const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {new:true, runValidators:true})

        //  res.send({
        //     message: "User updated successfully",
        //     data: updatedUser })
        res.json({ message: "User updated successfully", data: updatedUser })

        
    } catch (error) {

res.status(400).json({ message: error.message })

        
    }
})






//DUMMY COOKIE API-GET 

app.get("/set-cookie", (req,res)=> {
  res.cookie("test","manav123")
  res.send("Cookie set")
})

app.get("/get-cookie",(req,res)=>{
    console.log(req.cookies);
    res.send(req.cookies)
    
})


connectDB().then(()=>{

    console.log("Database conneciton established");
    app.listen(3000, ()=> {
    console.log(`Server is running at Port Number - 3000`);
    
})
    
}).catch((err)=>{
    console.error("Database cannot be connected");
})



// app.post("/signup", async (req,res)=>{
//     console.log(req.body)
// })

// app.use("/home",(req,res)=>{
//     res.send(`Home Page check`)
// })
// app.use("/about",(req,res)=>{
//     res.send(`About Page check`)
// })

// app.get("/user",(req,res)=> {
//     res.send(`Firstname: ${"Manav"}, Lastname: ${"Pandey"}`);
    
// })
// app.post("/user",(req,res)=> {
//     res.send(`Data is successfully saved in DB`);
    
// })
// app.delete("/user",(req,res)=> {
//     res.send(`Data is deleted successfully`);
    
// })