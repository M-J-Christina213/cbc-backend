import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique : true,
    },
    firstName : {
        type: String,
        required : true
    },
    secondName : {
        type: String,
        required : true
    },
    password : {
        type: String,
        required : true
    },
    isBlocked : {
        type : Boolean,
        default : false
    },
    type : {
        type : String,
        dafalut : "customer"
    },
    profilePicture :{
        type : String,
        png : "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-png%2Fuser&psig=AOvVaw0prEhzS2K2ruHm-DWmJtio&ust=1732185313918000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPCdiMiC64kDFQAAAAAdAAAAABAE"
    }
})

const User = mongoose.model("users", userSchema)

export default User;

