import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import axios from "axios";

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



export async function googleLogin(req, res) {
    console.log("Received Token:", req.body.token);

    let token = req.body.token;

    if (!token) {
        return res.status(400).json({ message: "Token is required" });
    }

    token = token.trim(); // Trim any whitespace

    try {
        const userResponse = await axios.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const userDetails = userResponse.data;
        console.log('User Details:', userDetails);

        const email = userDetails.email;
       //check if user exist
       const usersList = await User.find({ email: email });
       if (usersList.length > 0) {
           const user = usersList[0];
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
           })
       } else {
        //create new user
        const newUserData = {
            email: userDetails.email,
            firstName: userDetails.given_name,
            secondName: userDetails.family_name,
            type: "customer",
            password : "ccccccc",
            profilePicture: userDetails.picture,
        };
        const user = new User(newUserData);
        user.save()
            .then(() => {
                const token = jwt.sign(
                    {
                        email: user.email,
                        firstName: user.firstName,
                        secondName: user.secondName,
                        isBlocked: user.isBlocked,
                        type: user.type,
                        profilePicture: user.profilePicture,
                    }, process.env.SECRET)
                    
                    // Log the generated token for debugging
                console.log("Generated Token:", token);
                
                res.json({
                    message: "User created successfully.",
                    
                });
            })
            .catch((error) => {
                res.json({
                    message: "User not created.",
                    error: error.message,
                });
            });
       }
       
        

    } catch (error) {
        console.error("Google Login Error:", error.message);
        return res.status(500).json({
            message: "Google Login Failed",
            error: error.message,
        });
    }
}

// Admin - christina.rodrigo1@gmail.com - securepassword123
//customer - christina.Rodrigo@example.com - securepassword123