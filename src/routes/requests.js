const express = require('express')
const requestRouter = express.Router()
const {userAuth} = require('../middlewares/auth')
const User = require('../models/user')
const ConnectionRequest =  require('../models/connectionRequest')

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req,res)=>{
   try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId
    const status = req.params.status

    const allowedStatus = ["ignored","interested"]

    if(!allowedStatus.includes(status)){
        throw new Error("Invalid status type:" +status)}

    const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,})

    const toUser= await User.findById(toUserId)

    if(!toUser){
        throw new Error("User does not exist")}

    const existingConnectionRequest = await ConnectionRequest.findOne({
        $or:[
            {fromUserId, toUserId},
            {fromUserId: toUserId, toUserId: fromUserId}
        ]})

    if(existingConnectionRequest){
        throw new Error("Connection Request Already Exists")}

    const data = await connectionRequest.save()

    const statusMessages = {
  interested: "sent",
  ignored: "ignored"
};

    res.json({
        message:`${req.user.firstName} has ${statusMessages[status]} the connection request`,
        data})
   } catch (error) {
       res.status(400).send("Error:" + error.message)}})

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res)=> {

    try {
        // const status = req.params.status
        const {status,requestId} = req.params
        const {toUserId} = req.params
         const loggedInUser = req.user
         
        

        const allowedStatus = ["accepted", "rejected"] 

        if(!allowedStatus.includes(status)){
           throw new Error("Invalid status type:" +status)
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })

        if(!connectionRequest){
            throw new Error("No pending connection request found")
        }

        connectionRequest.status = status ;
        const data =   await connectionRequest.save()

        res.json({message: `Connection Request` +status, data})

        
    } catch (error) {
         res.status(400).send("Error:" + error.message)
    }

})       

module.exports = requestRouter;