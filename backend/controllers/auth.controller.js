import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signupUser = async (req, res) => {
    try {
        const { fullName, userName, password, confirmPassword, gender } = req.body;

        if(password != confirmPassword){
            return res.status(400).json({error: "Password dont match"});
        }

        const user = await User.findOne({userName});
        if(user){
            return res.status(400).json({error: "User already exist"});
        }

        //Hash Password here

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`

        const newUser = new User({
            fullName,
            userName,
            password: hashedPassword,
            gender,
            profilePic: gender == "male" ? boyProfilePic : girlProfilePic
        })

        if(newUser){
            //jwt token
            await generateTokenAndSetCookie(newUser._id, res);

            await newUser.save();


            return res.status(201).json({
                _id : newUser._id,
                fullName: newUser.fullName,
                userName: newUser.userName,
                gender: newUser.gender,
                
            });
        }else{
            return res.status(400).json({error: "Invalid User Data"});
        }
    } catch (error) {
        console.log("Error", error.message);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

export const loginUser = async (req, res) => {
    try {
        const { userName, password } =req.body

        const user = await User.findOne({userName});
        if(!user){
            return res.status(400).json({error: "Invalid username"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if(!isPasswordCorrect){
            return res.status(400).json({error: "Invalid password"});
        }

        await generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id : user._id,
            fullName: user.fullName,
            userName: user.userName,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.log("Error", error.message);
        return res.status(500).json({error: "Internal Server Error"})
    }
}

export const logoutUser = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({message:"Logout Successfully"});
    } catch (error) {
        console.log("Error", error.message);
        return res.status(500).json({error: "Internal Server Error"});
    }
}