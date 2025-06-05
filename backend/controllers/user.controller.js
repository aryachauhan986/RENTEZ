import User from "../model/user.model.js"

export const getCurrentUser=async(req,res)=>{
   try{
    let user=await User.findById(req.userId).select("-password").populate("listing","title image1 image2 image3 description rent category city landmark isBooked host ratings").populate("booking","title image1 image2 image3 description rent category city landmark isBooked host ratings");;   //data that we store in middle isAuth and removes password in it throught select(-password) 
    //populate means when quering then this data also come from listing collection
   //  console.log(user);
   //  console.log("ff");      
     if(!user){
        return res.status(400).json({message:"User does not found"});
     }

     return res.status(200).json(user);
   }
   catch(error){
        return res.status(500).json({message:`getCurrent User error ${error}`});
   }
}
