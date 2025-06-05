import uploadOnCloudinary from "../config/cloudinary.js";
import Listing from "../model/listing.model.js";
import User from "../model/user.model.js";


//controller for add the listing
export const addListing=async(req,res)=>{
    try{
        // console.log("ff");
        let host=req.userId;
        let {title,description,rent,city,landmark,category}=req.body;
        // console.log(title,description,rent,city,landmark,category);
        let image1=await uploadOnCloudinary(req.files.image1[0].path);
        // console.log("image1",image1);
        let image2=await uploadOnCloudinary(req.files.image2[0].path);
        // console.log("image2",image2);
        let image3=await uploadOnCloudinary(req.files.image3[0].path);
        // console.log(image1,image2,image3,host);
        let listing=await Listing.create({
            title,
            description,
            rent,
            city,
            landmark,
            category,
            image1,
            image2,
            image3,
            host
        });

        let user=await User.findByIdAndUpdate(host,{$push:{listing:listing._id}},{new:true});
        
        if(!user){
           return res.staus(400).json({message:"User not found"});
        }
      return  res.status(201).json(listing);
    }
    catch(error){
      return  res.status(500).json({message:`Add listing error ${error}`})
    }
}


//controller for get the listing
export const getListing=async(req,res)=>{
    try{
        let listing=await Listing.find().sort({createdAt:-1})//now sort the listing so the new listing will come first
       return res.status(200).json(listing);
    }
    catch(error){
       return res.status(500).json({message:`getListing error ${error}`});
    }
}


//controller for find the listing
export const findListing=async(req,res)=>{
     try{
           let {id}=req.params;//req.params hold the value that is passed with the route throught :454254 like
             let listing=await Listing.findById(id);
             if(!listing){
             return   res.status(404).json({message:"listing not found"});
             }
             return res.status(200).json(listing);
           
     } 
     catch(error){
          return res.status(500).json(`findListing error ${error}`);
     }
}

//controller for update the listing
export const updateListing=async(req,res)=>{
    // console.log("g");
    try{
        let image1,image2,image3;
        let {id}=req.params;
        let {title,description,rent,city,landmark}=req.body;
        // console.log(title,description,rent,city,landmark);
         if(req.files.image1){
         image1=await uploadOnCloudinary(req.files.image1[0].path);
         }
        // console.log("image1",image1);
          if(req.files.image2){
         image2=await uploadOnCloudinary(req.files.image2[0].path);
          }
        // console.log("image2",image2);
        if(req.files.image3){
         image3=await uploadOnCloudinary(req.files.image3[0].path);
        }
        // console.log("image3",image3);
        let listing=await Listing.findByIdAndUpdate(id,{
            title,
            description,
            rent,
            city,
            landmark,
            image1,
            image2,
            image3,
        },{new:true}); //new :true for updating new things
        // console.log(listing);
      return  res.status(201).json(listing);
    }
    catch(error){
       return res.status(500).json({message:`update error ${error}`})
    }
}


//controller for delete the listing
export const deleteListing=async(req,res)=>{
    try{
         let {id}=req.params;
         let listing=await Listing.findByIdAndDelete(id);
         let user=await User.findByIdAndUpdate(listing.host,{$pull:{listing:listing._id}},{new:true});

         if(!user){
            return res.status(404).json({message:"User not found"});
         }
         return res.status(201).json({message:"Listing deleted"});
    }
    catch(error){
        return res.status(500).json({message:`Delete listing error ${error}`});
    }
}


//controller for rate the list
export const ratingListing=async(req,res)=>{
  try{
     let {id}=req.params;
     let {ratings}=req.body;
     let listing=await Listing.findById(id);

     if(!listing){
      return res.status(404).json({message:"listing not found"});
     }

     listing.ratings=Number(ratings);
     await listing.save();

     return res.status(200).json({ratings:listing.ratings});
  }
  catch(error){
       return res.status(500).json({message:`Rating error ${error}`});
  }
}


//controller for search query
export const search=async(req,res)=>{
  try{
      const {query}=req.query;
      if(!query){
        return res.status(400).json({message:"Search query is required"});
      }

      const listing=await Listing.find({
        $or:[
          {landmark:{$regex: query,$options:'i'}}, //i tells we can search query in uppercase and lowercase too
          {city:{$regex: query,$options:'i'}},
          {title:{$regex: query,$options:'i'}},
        ]
      });

      return res.status(200).json(listing);
  }
  catch(error){
     console.log("search error ",error);
     return res.status(500).json({message:"Internal server error"});
  }
}

