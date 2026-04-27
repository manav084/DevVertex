const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userAuth = async (req, res, next) => {
    try {

        // token read
        const { token } = req.cookies;

        if (!token) {
            // throw new Error("Unauthorized")
          return  res.status(401).send("Please Login!")

        }
        // verify token 
        const decoded = jwt.verify(token, "SECRET_KEY")

        const { _id } = decoded;

        // find user 

        const user = await User.findById(_id)

        if (!user) {
            throw new Error("User not found")
        }
        // attach user to request
        req.user = user

        // since its middleware 
        next()


    } catch (error) {
        res.status(400).send("Unauthorized: " + error.message);


    }
    

}

module.exports = { userAuth }