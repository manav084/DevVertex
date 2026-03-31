const express = require("express")
  connectDB =require('./config/database.js')
const app = express();



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


connectDB().then(()=>{

    console.log("Database conneciton established");
    app.listen(3000, ()=> {
    console.log(`Server is running at Port Number - 3000`);
    
})
    
}).catch((err)=>{
    console.error("Database cannot be connected");
})

