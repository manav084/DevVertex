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

   },
   validateEditProfileData = (req) =>{


    const allowedEditFields = ["firstName", "lastName","age","about","skills","photoUrl","gender"]
    const keys = Object.keys(req.body)

    const isEditAllowed = keys.every((k)=> allowedEditFields.includes(k))

    // if(!isEditAllowed){
    //     throw new Error("Invalid Fields in Update")
    // }

  return isEditAllowed;
   
   }

   module.exports = {validateSignUpData , validateEditProfileData}