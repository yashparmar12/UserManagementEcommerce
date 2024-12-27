import jwt from "jsonwebtoken";
import jwtKey from "../jwtKey.js"

const Authenticated = async (req, res, next) => {
    try {
        const token = req.cookies.adminToken;
        console.log(req.cookies)
        console.log("tokennnnnnn",req.cookies.token)
        if(!token){
            res.status(400).json({
                message:"User not found",
                success:false
            })
        }

        const decode = jwt.verify(adminToken, jwtKey);
        if(!decode){
            res.status(400).json({
                message:"Invalid token",
                success:false
            })
        }
        // console.log(decode.id)
        req.adminid = decode.id;
        next(); 
    } catch (error) {
        console.log(error);
    }
}

export default Authenticated;