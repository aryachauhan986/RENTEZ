import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";
import bookingRouter from "./routes/booking.route.js";
import "./bookingcleaner.js"

dotenv.config(); //loads environment variables from .env file into process.env to provide security

const app=express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin:"https://rentez-frontend.onrender.com",   //to allow the request from this localhost too
    credentials:true
}))

let PORT=process.env.PORT || 6000;

app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/listing",listingRouter);
app.use("/api/booking",bookingRouter);


app.listen(PORT,()=>{
    connectDb();
console.log(`Server is listening on port ${PORT}`);
});
