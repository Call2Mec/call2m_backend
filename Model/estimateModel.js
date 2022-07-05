import mongoose from "mongoose";

const estimateSchema = mongoose.Schema({
  grandTotal: {
    type: String,
    required: [true, "A name is required"],
  },
  services: {
    type: [String],
    required: [true, "Please provide  contact details"],
  },
});

export default mongoose.model("Estimate", estimateSchema);
