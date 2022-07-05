import mongoose from "mongoose";

const BookingSchema = mongoose.Schema(
  {
    booking_ID: {
      type: String,
      unique: true,
    },
    customer_name: {
      type: String,
      required: [true, "A name is required"],
    },
    email: {
      type: String,
    },
    phone_no: {
      type: [String],
      required: [true, "Please provide  contact details"],
    },
    Customer_issues: {
      type: [String],
      required: [true, "Please provide  issues with car"],
    },
    Workshop: {
      type: mongoose.Schema.ObjectId,
      ref: "Workshop",
    },
    vehicle_details: {
      type: mongoose.Schema.ObjectId,
      ref: "Vehicle",
    },
    assignedTo: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "new",
    },
    // md added two schema here---
    payment_status: {
      type: String,
      default: "NotPaid",
    },
    booking_type: {
      type: String,
      default: "b2b",
    },
    payment_date: {
      type: String,
      default: "Not paid yet",
    },
    delivery_date: {
      type: String,
      default: "Not Delivered",
    },
    payment_mode: {
      type: String,
      default: "Cashless",
    },
    // to here -------
    estimate: {},
    //Md worked here------
    service_type: {
      type: String,
    },
    transmission_type: {
      type: String,
    },
    fuel_type: {
      type: String,
    },
    tyre_size: {
      type: String,
    },
    //To here-------
    car_name: {
      type: String,
    },
    car_model: {
      type: String,
    },
    vehicle_no: {
      type: String,
    },
    delivery_img: {
      type: String,
    },
  },
  { timestamps: true }
);

BookingSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.booking_ID =
      Date.now() + Math.floor(Math.random() * (2000 - 100 + 1) + 100);
  }
  next();
});

BookingSchema.pre(/^find/, function (next) {
  this.populate({ path: "assignedTo", select: "name email phone" })
    .populate({
      path: "Workshop",
    })
    .populate({ path: "vehicle_details" });
  next();
});
export default mongoose.model("Booking", BookingSchema);
