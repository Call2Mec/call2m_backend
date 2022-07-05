import mongoose from "mongoose";
import validator from "validator";

const workshopSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "A name is required"],
  },
  phoneNo: {
    type: [String],
    required: [true, "Please provide  contact details"],
  },
  email: {
    type: String,
    required: {
      values: true,
      message: "Please provide your email",
    },
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  state: {
    type: String,
    required: [true, "Please provide  State"],
  },
  city: {
    type: String,
    required: [true, "Please provide  city"],
  },
  addressProof: {
    type: String,
    default: "default.jpg",
  },
  vucProof: {
    type: String,
    default: "default.jpg",
  },
  aadhar: {
    type: String,
    default: "default.jpg",
  },
  pan: {
    type: String,
    default: "default.jpg",
  },
  gst: {
    type: String,
    default: "default.jpg",
  },
  tradeliscence: {
    type: String,
    default: "default.jpg",
  },
  ghmcpermission: {
    type: String,
    default: "default.jpg",
  },
  cancelcheque: {
    type: String,
    default: "default.jpg",
  },
});

export default mongoose.model("Workshop", workshopSchema);
