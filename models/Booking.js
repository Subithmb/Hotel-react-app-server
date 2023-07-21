const mongoose=require("mongoose"); 

// user sign-up schema

const BookingSchema = new mongoose.Schema({
    name: {
      type: "String",
      required: true
    },
    bookingId: {
      type: "String", 
    },
    paymentId: {
      type: "String", 
    },
        phone: {
      type: "number",
      required: true
    },
    total: {
      type: "number",
      required: true
    },
    discount: {
      type: "number",
    },
    UpdatedTotal: {
      type: "number",
      required: true
    },
    tax: {
      type: "number",
      required: true
    },
    serviceFee: {
      type: "number",
      required: true
    },
    totalDays: {
      type: "number",
      required: true
    },
    guest: {
      type: "number",
      required: true
    },
    checkIn: {
      type: "date",
      required: true
    },
    checkOut: {
      type: "date",
      required: true
    },
    isCancel: {
      type: "boolean",
      default:false
    },
    paymentStatus: {
      type: "boolean",
      default:false
    },
    userID: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
      },
      hotelID: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hotel',
        required: true,
      },  
  },
  {timestamps:true}
  );


 module.exports = mongoose.model("Booking",BookingSchema);
  