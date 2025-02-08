import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

export function createUser(req, res) {
    const newUserData = req.body;

    if (newUserData.type === "admin") {
        if (!req.user) {
            return res.json({
                message: "Please login as administrator to create admin accounts."
            });
        }
    
        if (req.user.type !== "admin") {
            return res.json({
                message: "Only administrators can create admin accounts."
            });
        }
    }
    newUserData.password = bcrypt.hashSync(newUserData.password, 10);

    const user = new User(newUserData);
    user.save()
        .then(() => {
            res.json({
                message: "User created successfully.",
            });
        })
        .catch((error) => {
            res.json({
                message: "User not created."
            });
        });
}
export function loginUser(req, res) { 
    User.find({ email: req.body.email }).then((users) => {
        if (users.length == 0) {
            res.json({
                message: "User not found",
            });
        } else {
            const user = users[0];
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
            if (isPasswordCorrect) {
                const token = jwt.sign(
                    {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        isBlocked: user.isBlocked,
                        type: user.type,
                        profilePicture: user.profilePicture,
                    }, process.env.SECRET)
                    
                    // Log the generated token for debugging
                console.log("Generated Token:", token);
                
                res.json({
                    message: "User logged in",
                    token: token,
                    user : {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        type: user.type,
                        profilePicture : user.profilePicture,
                        email : user.email
                    }
                });
            } else {
                res.json({
                    message: "User not logged in (wrong password)",
                });
            }
        }
    });
}

export function isAdmin(req){
 if(req.user===null){
    return false
 }
 if (req.user.type !== "admin"){
    return false
 }
 return true
}

export function isCustomer(req){
    if(req.user===null){
        return false
    }

    if(req.user.type !== "customer"){
        return false
    }

    return true
}

export async function googleLogin(req,res){
    const token = await axios.get('https://www.googleapis.com/oauth2/v3/userInfo',{
        headers:{
            Authorization : `Bearer ${token}`
        }
    })

    try{


    }catch(e){
        res.json({
            message : "Google Login Failed"
        })
    }
}

// Admin - christina.rodrigo1@gmail.com - securepassword123
//customer - christina.Rodrigo@example.com - securepassword123