import mongoose from "mongoose";

const supportSchema = mongoose.Schema({
  number: {
    type: String,

    unique: true,
  },

  openedOn: {
    type: Date,
    default: Date.now(),
  },
  cusomer_id: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "closed"],
    default: "active",
  },
  description: {
    type: String,
    required: [true, "description is required"],
  },
  assigned: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

supportSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.number = `INC${Math.floor(Math.random() * (99999 - 9999 + 1)) + 9999}`;
  }
  next();
});

export default mongoose.model("Support", supportSchema);
