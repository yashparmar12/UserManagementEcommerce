import jwt from "jsonwebtoken";
import jwtKey from "../jwtKey.js";

const Authenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(403).json({
      message: "User not found",
      success: false,
    });

  try {
    const decoded = jwt.verify(token, jwtKey);

    if (!decoded) {
      res.status(400).json({
        message: "Invalid token",
        success: false,
      });
    }

    req.id = decoded.id;
    next();
  } catch (error) {
    console.log(error);
  }
};

export default Authenticated;



// try {
//     const token = req.cookies.token;
//     // console.log(req.cookies)
//     // console.log("tokennnnnnn",req.cookies.token)
//     if(!token){
//         res.status(400).json({
//             message:"User not found",
//             success:false
//         })
//     }

//     const decode = jwt.verify(token, jwtKey);
//     if(!decode){
//         res.status(400).json({
//             message:"Invalid token",
//             success:false
//         })
//     }
//     // console.log(decode.id)
//     req.id = decode.id;
//     next(); 
// } catch (error) {
//     console.log(error);
// }