import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
     try {
        const token = req.cookies.jwt;
        // const headerToken = req.headers['authorization'].split(" ");
        // const token = headerToken[1];
        // console.log(token[1])
        

        if(!token){
            return res.status(401).json({ error: "Unauthrized - No Token Provided" });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if(!decode){
            return res.status(401).json({ error: "Unauthrized - invalid Token" });
        }

        const user = await User.findById(decode.userId).select("-password");
        if(!user){
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        console.log("Protected Middleware Passed")
        next();
     } catch (error) {
        console.log("Error in protectedRoute", error.message);
        return res.status(500).json({error: "Internal Server Error"});
     }
}

export default protectRoute;