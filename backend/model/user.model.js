import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    listing:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Listing"
    }],
    booking:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Listing"
    }]
},{timestamps:true});  //to know where our user is created and updated

const User=mongoose.model("User",userSchema);

export default User;