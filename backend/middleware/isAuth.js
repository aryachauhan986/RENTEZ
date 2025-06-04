import jwt from "jsonwebtoken";

const isAuth=async(req,res,next)=>{
    try{
        let token=req.cookies.token;  //to fetch the token from cookies
        // console.log(token);
        if(!token){
            return res.status(400).json({message:"User does not have a token"});
        }
        let verifyToken=jwt.verify(token,process.env.JWT_SECRET);
        if(!verifyToken){
            return res.status(400).json({message:"User does not have valid token"});
        }
        req.userId=verifyToken.userId;
        // console.log("verify");
    //    console.log("id",req.userId);
        next();
    }
    catch(error){
      res.status(500).json({message:`isAuth error ${error}`});
    }
}
export default isAuth;