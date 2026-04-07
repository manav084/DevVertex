const express = require("express")
  connectDB =require('./config/database.js')
const app = express();
const User = require('./models/user')

app.use(express.json())

app.use(express.static("public"))


 // Sending a details of a user required for login after signup
app.post("/signup", async (req,res)=>{
    
    // Creating a  new instance of te User model
    const user = new User(req.body)
    try {

        const {firstName, emailId , password} = req.body;

        if(!firstName,  !emailId, !password){
            return res.status(400).send("Required fields Missing")
        }

        const emailRegex = /^\S+@\S+\.\S+$/;

        if(!emailRegex.test(emailId)){
        return res.status(400).send("Invalid Email Format")
        }

        if(password.length <8){
            return res.status(400).send("Password length is less than 8 characters")

        }

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

      await  user.save()
        res.send("User Added Successfully")
        
    } catch (err) {
        res.status(400).send("Error saving the User" + err.message)
        
    }

})


// Fetch a user by EmailID. if there are multiple  sane email id's it'll fetch only one 
app.get("/getuser", async (req,res)=> {
    const userEmail =  req.body.emailId ; 

   try {
      
    const user = await User.findOne({ emailId : userEmail})
    if(user){
    res.send(user)
}else{
     res.status(404).send("Error not finding the user email")
}


   } catch (error) {

 res.status(400).send("Error saving the User" + err.message)    
   }


})

 // Fetch list of all users present in a database

app.get("/feed", async (req,res)=> {
    
    
    
    try {
        const users = await User.find({})

        if(users.length> 0){

            res.send(users)
        }else{
            res.status(404).send("Unable to fetch user data")
        }

        
    } catch (error) {

         res.status(400).send("Error saving the User" + error.message)    


        
    }

})

// Delete user find by id and delete

app.delete("/user", async (req,res)=> {

      const deleteId = req.body.deleteId
    
      
      try {
        const user = await User.findByIdAndDelete(deleteId)
        if(user){
        res.send("User Deleted Successfully")
        }else{
            res.status(404).send("User  already deleted or User does not created")
        }
    } catch (error) {

         res.status(400).send("Error saving the User" + error.message)    

    }
})


// Update the user using patch (patch just replace only  change part )

app.patch("/user/:userId", async (req,res)=>{
    // const userId = req.params?.userId 

    const {userId} = req.params
    const updatedData = req.body

    if (!userId) {
  return res.status(400).send("UserId is required");
}


    const allowedUpdates = ["firstName","lastName","photoUrl","about","gender","age", "skills"]
    const keys = Object.keys(updatedData);

    const isAllowedUpdates = keys.every((k)=>{
        return allowedUpdates.includes(k)
    })

    if(!isAllowedUpdates){
      return   res.status(400).send("Updates not allowed")
    }

      

    try {

        if(updatedData.skills){
            if(!Array.isArray(updatedData.skills)){
                   return res.status(400).send("Skills must be an array");
            }
        

        if(updatedData.skills.length > 10){
            throw new Error("Skills cannot be more than 10")

        }

          updatedData.skills = updatedData.skills.map(skill => skill.trim().toLowerCase())

          updatedData.skills = [...new Set(updatedData.skills)]


    }
         const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {new:true, runValidators:true})

         res.send({
            message: "User updated successfully",
            data: updatedUser })


        
    } catch (error) {

            res.status(400).send("Update failed" + error.message)    

        
    }
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