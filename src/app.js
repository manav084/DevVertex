const express = require("express")
  connectDB =require('./config/database.js')
const app = express();
const User = require('./models/user')

app.use(express.json())


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