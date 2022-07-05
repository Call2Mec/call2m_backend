import crypto from "crypto";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
 
const otpSchema = mongoose.Schema({

  email: {
    type: String,
    required: {
      values: true,
      message: "Please provide your email",
    },
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  
  otp: {
    type: String,
    required: [true, "input Otp here"],
  },
  expireIn:Number
});
export default mongoose.model("otp", otpSchema);
