import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

export function createUser(req, res) {
    const newUserData = req.body;

    if (newUserData.type === "admin") {
        if (!req.user) {
            res.json({
                message: "Please login as administrator to create admin accounts."
            });
            return;
        }

        if (req.user.type !== "admin") {
            res.json({
                message: "Only administrators can create admin accounts."
            });
            return;
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
        .catch((e) => {
            res.json({
                message: "User not created. Error: " + e.message
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
                });
            } else {
                res.json({
                    message: "User not logged in (wrong password)",
                });
            }
        }
    });
}


// Admin - christina.Rodrigo@gmail.com - securepassword123
//customer - christina.Rodrigo@example.com - securepassword123