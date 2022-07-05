import Vehicle from "../Model/vehicleModel.js";
import { getAll, updateOne, deleteOne, createOne } from "./handleFactory.js";
import catchAssync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, files, cb) {
    cb(null, "./uploads/");
  },
  // filename: function (req, files, cb) {
  //   const type = files.mimetype.split("/")[1];
  //   cb(null, `${files.fieldname}-${req.params.id}-${Date.now()}.${type}`);
  // },
});
const uploads = multer({ storage: storage });

export const addVehicle = createOne(Vehicle, "vehicle");

export const uploadMiddleware = uploads.array("vehicle", 6);

export const uploadPhotos = catchAssync(async (req, res, next) => {
  const { id } = req.params;
  const files = req.body;
  // const photos = req.files.map((item) => item.filepreview);
  // const photos = req.files.map((item) => item.filename);
  
  

  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    return next(new AppError("no workshop found", 400));
  }
  vehicle.photo = files;

  await vehicle.save();
  res.json({ status: "success" });
});

export const allVehicle = getAll(Vehicle);

export const deleteVehicle = deleteOne(Vehicle);

export const updateVehicle = updateOne(Vehicle);
