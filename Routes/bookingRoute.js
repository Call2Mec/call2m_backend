import express from "express";
const router = express.Router();

import {
  createBooking,
  allBooking,
  updateBooking,
  deleteBooking,
  singleBooking,
  sendEstimate
} from "../Controller/bookingController.js";

router.post("/create", createBooking);
router.get("/all", allBooking);
router.patch("/update/:id", updateBooking);
router.delete("/delete/:id", deleteBooking);
router.post("/sendEmail",sendEstimate );
// chandan created route 
router.get("/all/:id", singleBooking);


export default router;
