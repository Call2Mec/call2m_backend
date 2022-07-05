import CatchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Support from "../Model/customerSupport.js";
import Vehicle from "../Model/vehicleModel.js";

export const addComplain = CatchAsync(async (req, res, next) => {
  const { description, cusomerId } = req.body;

  const vehicle = await Vehicle.findOne({ customerID: cusomerId });
  if (!vehicle) {
    return next(new AppError("no customer found", 404));
  }

  await Support.create({ cusomer_id: cusomerId, description });
  res.status(200).json({ status: "Success", message: "complain registered" });
});

export const changeStatus = CatchAsync(async (req, res, next) => {
  const { Id } = req.params;

  const complain = await Support.findById(Id);
  if (!complain) {
    return next(new AppError("no complain found", 404));
  }

  complain.status = complain.status === "active" ? "closed" : "active";
  await complain.save();
  res.status(200).json({ status: "Success", message: "status changed" });
});

export const getAll = CatchAsync(async (req, res, next) => {
  const allComplain = await Support.find().populate("user", "name");
  if (allComplain.length === 0) {
    return next(new AppError("no complain found", 404));
  }

  res.status(200).json({ status: "Success", data: allComplain });
});

export const deletById = CatchAsync(async (req, res, next) => {
  const { Id } = req.params;
  await Support.findByIdAndDelete(Id);
  res
    .status(200)
    .json({ status: "Success", message: "complain removed successfully" });
});

export const getUserComplain = CatchAsync(async (req, res, next) => {
  const { cusomerId } = req.body;

  const complain = await Support.find({ cusomer_id: cusomerId });
  if (!complain) {
    return next(new AppError("no complain found", 404));
  }
  res.status(200).json({ status: "Success", data: complain });
});
