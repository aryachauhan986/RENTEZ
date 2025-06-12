import React, { createContext, useContext, useState } from 'react'
import { authDataContext } from './AuthContext';
import axios from 'axios';
import { userDataContext } from './UserContext';
import { listingDataContext } from './ListingContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const bookingDataContext=createContext();

export default function BookingContext({children}) {
   let [checkIn,setCheckIn]=useState("");
    let [checkOut,setCheckOut]=useState("");
    let [total,setTotal]=useState(0); //total amount
    let [night,setNight]=useState(0);
    let {serverUrl}=useContext(authDataContext);
    let {getCurrentUser}=useContext(userDataContext);
    let {getListing}=useContext(listingDataContext);
    let [bookingData,setBookingData]=useState([]);
    let [booking,setBooking]=useState(false);
    let navigate=useNavigate();

    const handleBooking=async(id)=>{
         setBooking(true);
        // console.log(id);
        try{
            // console.log("ff");
          let result=await axios.post(serverUrl+`/api/booking/create/${id}`,{
            checkIn,checkOut,totalRent:total
          },{withCredentials:true});
          await getCurrentUser();
          await getListing();

          setBookingData(result.data);
          setBooking(false);
          console.log(result.data);
          navigate("/booked");
          toast.success("Booking successfully");
        }
        catch(error){
          console.log(error);
          setBooking(false);
          setBookingData(null);
          toast.error(error.response.data.message);
        }
    }

    const cancelBooking=async(id)=>{
          try{
                   // console.log("ff");
          let result=await axios.delete(serverUrl+`/api/booking/cancel/${id}`,{withCredentials:true});
          await getCurrentUser();
          await getListing();
          console.log(result.data);
          toast.success("Cancel Booking Successfully");
          }
          catch(error){
            console.log(error);
            toast.error(error.response.data.message);
          }
    }


    let value={
        checkIn,setCheckIn,
        checkOut,setCheckOut,
        total,setTotal,
        night,setNight,
        bookingData,setBookingData,
        handleBooking,
        cancelBooking,
        booking,setBooking

    }

  return (
    <div>
        <bookingDataContext.Provider value={value}>
            {children}
            </bookingDataContext.Provider>
    </div>
  )
}
