const mongoose = require('mongoose')
 const validator = require('validator')
 const userSchema = new mongoose.Schema({

    firstName:{
        type: String,
        required: true,
        minLength:2,
        maxLength:25,
        trim:true,
    },

    lastName:{
        type: String,
        trim:true,
        maxLength:25,
        minLength:1
        

    },
    emailId:{
        type:String,
          required: true,
          unique: true,
          lowercase: true,
          trim: true,
        //   match: [/^\S+@\S+\.\S+$/, "Invalid email format"],

        validate(value){
            if(!validator.isEmail(value)){
                throw new error("Invalid email format")
            }
        }

    },
    password:{
        type:String,
         required: true,
        //  minLength: 8,

         validate(value){
            if(!validator.isStrongPassword(value)){
                throw new error("Password is not strong enough")
            }
        }

        

    },
    age:{
        type:Number,
        min:18,
        max:65,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid")
            }

        }
    },

    photoUrl:{
        type:String,
       default: "http://localhost:3000/images/userProfile.png",
    },
    about:{
        type:String,
        default: "This user has not added a bio yet.",
        maxLength: 200
    },
    skills:{
        type:[String],
    },

 }, 
 {
    timestamps: true,
 }

)

 module.exports = mongoose.model("User",userSchema)

 