import CatchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Booking from "../Model/BookingModel.js";
import { getAll, deleteOne, updateOne, findOne } from "./handleFactory.js";
import User from "../Model/UserModel.js";
import Workshop from "../Model/workshopModel.js";
import Vehicle from "../Model/vehicleModel.js";
import Email from "../utils/email.js";

//md added this tow line below---------
import express from "express";
import path from "path";
const app = express();
// app.use("/public", express.static(path.join(__dirname, "public")));

export const createBooking = CatchAsync(async (req, res, next) => {
  const {
    name,
    phone,
    issues,
    // Md passed some data from here here--------
    service_type,
    transmission_type,
    fuel_type,
    tyre_size,
    car_name,
    car_model,
    delivery_img,
    vehicle_no,
    email,
    booking_type,
  } = req.body;
  // const contacts = phone;
  // const problems = issues;
  const contacts = phone.split(",");
  const problems = issues.split(",");
  /* if (contacts.length < 2) {
    return next(new AppError("atlease two contact number needed", 401));
  } */
  const newBooking = await Booking.create({
    customer_name: name,
    phone_no: contacts,
    Customer_issues: problems,
    service_type,
    transmission_type,
    fuel_type,
    tyre_size,
    car_name,
    car_model,
    delivery_img,
    vehicle_no,
    email,
    booking_type,
  });
  res.status(200).json({ status: "success", details: newBooking });
});

export const allBooking = getAll(Booking);
// chandan created
export const singleBooking = findOne(Booking);

export const updateBooking = updateOne(Booking);

export const deleteBooking = deleteOne(Booking);

export const sendEstimate = CatchAsync(async (req, res, next) => {
  const { email, message, subject, file, phone } = req.body;
  if (file) {
  }
  // const attachments = [
  //   {
  //     filename: "mypdf.pdf",
  //     // path: path.join(__dirname, "./mypdf.pdf"),
  //     contentType: "application/pdf",
  //   },
  // ];
  try {
    const emailsend = new Email(email);
    await emailsend.sendEstimate(message, subject, file, phone);
    res.status(200).json({ status: "success", message: "Email sent" });
  } catch (error) {
    next(new AppError("email sending failed"));
  }
});
