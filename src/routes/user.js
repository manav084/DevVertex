const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router()
const User = require('../models/user')

// Get all the pending connection requests for the loggedin user
userRouter.get("/user/requests/received", userAuth, async(req,res)=> {
 try {

    const loggedInUser = req.user

   const connectionRequests = await ConnectionRequest.find({
    toUserId: loggedInUser._id ,
    status: "interested"
   }).populate("fromUserId",["firstName","lastName","photoUrl","age","gender","about","skills","experience","role"])

 

   if(connectionRequests.length === 0){
     return res.status(200).json({
        message:"No pending connection requests found",
        data: []
     })
   }
    return  res.status(200).json({message:"Incoming connection requests retrieved successfully",
             data: connectionRequests })
    
 } catch (error) {
res.status(400).json({ message: error.message }) }
    


})

userRouter.get("/user/connections", userAuth, async(req,res)=>{
  try {

    const loggedInUser = req.user 

      
    const connectionRequests = await ConnectionRequest.find({
        status: "accepted",
        $or:[
        
        { toUserId : loggedInUser._id},
        { fromUserId: loggedInUser._id }
        
      ],

    }

      
      
    ).populate("fromUserId",["firstName","lastName","photoUrl","age","gender","about","skills","experience","role"])
     .populate("toUserId",["firstName","lastName","photoUrl","age","gender","about","skills","experience","role"])

     if(connectionRequests.length === 0){
      return res.status(200).json({message: "No connections found", data:[]})

     }

     const data = connectionRequests.map((row)=> {
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
          return row.toUserId
        }
        return row.fromUserId
     })

      return  res.status(200).json({message:"Incoming connection requests fetched successfully",
             data: data })


  }
 catch (error) {
res.status(400).json({ message: error.message })

  }
})

userRouter.get("/feed", userAuth, async(req,res)=>{
  try {
    const loggedInUser = req.user ;

    const page =  parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 10
        limit = limit > 50 ? 50 : limit
    const skip = (page-1) * limit

    const ConnectionRequests = await ConnectionRequest.find({
      $or:[

        {toUserId: loggedInUser._id},{fromUserId: loggedInUser._id},

      ]
    }).select("fromUserId toUserId")

    const hideUsersFromFeed = new Set()

    ConnectionRequests.forEach((req)=>{
      hideUsersFromFeed.add(req.fromUserId.toString())
      hideUsersFromFeed.add(req.toUserId.toString())
    })

    const users = await User.find({

      $and: [{ _id: {$nin: Array.from(hideUsersFromFeed)}},

           {_id: {$ne: loggedInUser._id}}
      ]
   
    }).select("firstName lastName photoUrl about skills experience role").skip(skip).limit(limit)

     return res.json({
    message: "Feed fetched successfully",
    data: users
  });
     

    
  } catch (error) {
res.status(400).json({ message: error.message })
  }
})

module.exports = userRouter ;


