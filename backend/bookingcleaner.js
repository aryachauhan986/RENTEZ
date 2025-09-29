import cron from "node-cron";
import Booking from "./model/booking.model.js";
import Listing from "./model/listing.model.js";

// run every 1 minute
cron.schedule("* * * * *", async () => {
  const now = new Date();

  // find expired bookings
  const expiredBookings = await Booking.find({
    checkOut: { $lte: now },
    status: "booked"
  });

  for (let booking of expiredBookings) {
    // mark listing available again
    await Listing.findByIdAndUpdate(booking.listing, { isBooked: false });

    // delete the booking
    await Booking.findByIdAndDelete(booking._id);
  }

  if (expiredBookings.length > 0) {
    console.log(`Cleaned ${expiredBookings.length} expired bookings`);
  }
});
