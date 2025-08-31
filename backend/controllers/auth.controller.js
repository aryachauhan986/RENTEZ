import genToken from "../config/token.js";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs"

export const signUp=async(req,res)=>{
        try{
            let {name,email,password}=req.body;
            let existUser=await User.findOne({email});
            if(existUser){
                return res.status(400).json({message:"User already exist"});    
            }
            let hashPassword=await bcrypt.hash(password,10);  //add 10 characters in it randomly to strong the password
            let user=await User.create({name,email,password:hashPassword}); 
            
            let token = await genToken(user._id);

            //store token into cookie
            res.cookie("token",token,{
                httpOnly:true,      //because our server is local server when we deploy it use httpsOnly
                secure:true,
                sameSite:"none", //cookie data will sent through request if request is from same site/website
                maxAge: 7*24*60*60*1000
            })

            return res.status(201).json(user);

        }
        catch(error){ 
            return res.status(500).json({message:`signup error ${error}`});  //500 for server error
        }
}


export const login=async(req,res)=>{
    try{
         let {email,password}=req.body;
        //  console.log(email,password);
         let user=await User.findOne({email}).populate("listing","title image1 image2 image3 description rent category city landmark isBooked host");
        //  console.log(user);
            if(!user){
                return res.status(400).json({message:"User not exist"});    
            }
        
            let isMatch= await bcrypt.compare(password,user.password);
            if(!isMatch){
                return res.status(400).json({message:"Incorrect password"});
            }
            
            let token = await genToken(user._id);
            //store token into cookie
            res.cookie("token",token,{
                httpOnly:true,      //because our server is local server when we deploy it use httpsOnly
                secure:true,
                sameSite:"none",
                maxAge: 7*24*60*60*1000
            })
            // console.log(token);
            
            return res.status(200).json(user);
    }
    catch(error){
        return res.status(500).json({message:`login error ${error}`});
    }
}

export const logout=async(req,res)=>{
     try{
          res.clearCookie("token");
          return res.status(200).json({message:"Logout successfully"});
     }
     catch(error)
     {
        return res.status(500).json({message:`logout error ${error}`});
     }
}

