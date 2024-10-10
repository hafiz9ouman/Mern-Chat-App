import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = async (userId, res) => {
    const token = await jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '15d'
    })
    
    // set in header
    res.setHeader('Authorization', `Bearer ${token}`);

    // set in cookie
    // res.cookie("jwt", token, {
    //     maxAge: 15 * 24 * 60 * 60 * 1000,
    //     httpOnly: true,
    //     sameSite: "strict",
    //     secure: process.env.NODE_ENV !== "development"
    // })
}

export default generateTokenAndSetCookie;