const express = require('express')
const {userAuth} = require('../middlewares/auth')
  const {validateEditProfileData} =require('../utils/validator')

  const profileRouter = express.Router()
  profileRouter.get("/profile/view", userAuth , (req,res)=>{
  try {
    const user = req.user
    res.send(user)
    
  } catch (error) {
            res.status(401).send("Error: " + error.message);

  }
  
  // try {
  //   const {token} = req.cookies ; 

  //   if(!token){
  //     throw new Error("Unauthorized")
  //   }

  //   // verify token 

  //   const decoded = jwt.verify(token,"SECRET_KEY")

  //   const user = await User.findById(decoded._id)
  //   res.send(user)

    
  // } catch (error) {

  //    res.status(401).send("Invalid token" + error.message);
    
  // }
})

profileRouter.patch("/profile/edit", userAuth, async (req,res) =>{
    try {

    if (!validateEditProfileData(req)){
        throw new Error("Invalid Edit Requests")
    }
    const loggedInUser = req.user

    Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key] )

    await loggedInUser.save()

    // res.send(`${loggedInUser.firstName}, your profile updated successfully;`)

    res.json({
        message:`${loggedInUser.firstName}, your profile updated successfully;` ,
        data: loggedInUser
    })
    
    } catch (error) {
    res.status(400).send("Error: " + error.message);

    }
} )

module.exports = profileRouter ;