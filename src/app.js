const express = require("express")
  connectDB =require('./config/database.js')
const app = express();
const User = require('./models/user')

app.use(express.json())


 // Sending a details of a user required for login after signup
app.post("/signup", async (req,res)=>{
    
    // Creating a  new instance of te User model
    const user = new User(req.body)
    try {
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

app.patch("/user", async (req,res)=>{
    const userId = req.body.userId 
    const updatedData = req.body

    try {

         const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {new:true})

         res.send({
            message: "User updated successfully",
            data: updatedUser })


        
    } catch (error) {

            res.status(400).send("Error saving the User" + error.message)    

        
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