import Booking from "../model/booking.model.js";
import Listing from "../model/listing.model.js";
import User from "../model/user.model.js";


export const createBooking=async(req,res)=>{
    try{
      // console.log(req.UserId);
       let {id}=req.params;
      // console.log(id);
       let {checkIn,checkOut,totalRent}=req.body;

       let listing=await Listing.findById(id);
      //  console.log(listing);
       if(!listing){
        return res.status(404).json({message:"Listing not found"});
       }

       if(new Date(checkIn)>=new Date(checkOut))
         {//console.log("gg");
            return res.status(400).json({message:"Invalid CheckIn/CheckOut date"});
         }
         
         if(listing.isBooked){ //coming from user controller
            // console.log("hell0");
         return res.status(400).json({message:"Already Booked"});
      }
      // console.log(checkIn,checkOut,totalRent,listing.host,req.UserId,listing._id);
       let booking =await Booking.create({
        checkIn,
        checkOut,
        totalRent,
        host:listing.host,
        guest:req.userId,
        listing:listing._id
       });
       await booking.populate("host","email")
      // console.log(booking);

       let user=await User.findByIdAndUpdate(req.userId,{$push:{booking:listing}},{new:true});

       if(!user){
        return res.status(404).json({message:"User not found"});
       }
      // console.log("wr");

       listing.guest=req.userId;
       listing.isBooked=true;
       await listing.save();
       return res.status(201).json(booking);
    }
    catch(error){
        return res.status(500).json({message:`Booking error ${error}`}); 
    }
}

export const cancelBooking=async(req,res)=>{
   try{
      let {id}=req.params;
      let listing=await Listing.findByIdAndUpdate(id,{isBooked:false});
      let user=await User.findByIdAndUpdate(listing.guest,{$pull:{booking:listing._id}},{new:true});
      // console.log(user);
      if(!user){
         return res.status(404).json({message:"User not found"});
      
      }
      return res.status(200).json({message:"Booking cancelled"})
   }
   catch(error){
        return res.status(500).json({message:"Booking cancel error"});
   }
}