const express = require("express")

const app = express();

app.use("/home",(req,res)=>{
    res.send(`Home Page check`)
})
app.use("/about",(req,res)=>{
    res.send(`About Page check`)
})

app.listen(3000, ()=> {
    console.log(`Server is running at Port Number - 3000`);
    
})