 const validator = require('validator')   

const validateSignUpData =(req) =>{

    const {firstName, lastName, emailId, password} = req.body ; 

    if(!firstName || !lastName || !emailId){
        throw new Error("Required Fields Missing")
    }

    if(!validator.isEmail(emailId)){
        throw new Error("Invalid Email Format")
    }

    if(!validator.isStrongPassword(password)){
        throw new Error("Weak Password")
    }

   }

   module.exports = {validateSignUpData}