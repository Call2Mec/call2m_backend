import mongoose from "mongoose";

const vehicleSchema = mongoose.Schema({
  customerID: {
    type: Number,
    default: 0,
  },
  customerName: {
    type: String,
    required: [true, "A name is required"],
  },
  carName: {
    type: String,
    required: [true, "car name is required"],
  },
  carModel: {
    type: String,
    required: [true, "car model is required"],
  },
  
  registrationNo: {
    type: String,
    required: [true, "registration number is required"],
    unique: true,
  },
  reeding: {
    type: String,
    required: [true, "Reeding is required"],
  },
  type: {
    type: String,
    required: [true, "type is required"],
  },
  transmissionType: {
    type: String,
  },
  tyreSize: {
    type: String,
  },
  serviceType: {
    type: String,
  },
  timings: {
    type: Date,
  },
  photo: {
    type: [String],
  },
});

export default mongoose.model("Vehicle", vehicleSchema);
