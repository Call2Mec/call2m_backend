import Fleet from "../Model/fleetModel.js";
import multer from "multer";
import catchAssync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { getAll, deleteOne, updateOne, findOne } from "../Controller/handleFactory.js";
const storage = multer.diskStorage({
  destination: function (req, files, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, files, cb) {
    const type = files.mimetype.split("/")[1];
    cb(null, `${files.fieldname}-${req.params.id}-${Date.now()}.${type}`);
  },
});
const uploads = multer({ storage: storage });

export const addFleet = catchAssync(async (req, res, next) => {
  const { name, phone, email, state, city ,alternateNumber} = req.body;
  const fleet = await Fleet.create({
    name,
    phoneNo: [phone,alternateNumber],
    email,
    state,
    city,
  });
  res.status(200).json({ statue: "success", data: fleet });
});

export const uploadMiddleware = uploads.fields([
  { name: "address", maxCount: 1 },
  { name: "vuc", maxCount: 1 },
  { name: "pan", maxCount: 1 },
  { name: "aadhar", maxCount: 1 },
  { name: "gst", maxCount: 1 },
  { name: "tradelisc", maxCount: 1 },
  { name: "ghmcper", maxCount: 1 },
  { name: "cancelcheq", maxCount: 1 },
]);

export const uploadPhotos = catchAssync(async (req, res, next) => {
  const { id } = req.params;
  const { address, vuc,pan ,aadhar,gst,tradelisc,ghmcper,cancelcheq} = req.files;
  console.log("upload", req.files)

  const fleet = await Fleet.findById(id);
  if (!fleet) {
    return next(new AppError("no fleet found", 400));
  }
  fleet.addressProof = address[0].filename;
  fleet.vucProof = vuc[0].filename;
  fleet.aadhar = aadhar[0].filename;
  fleet.pan = pan[0].filename;
  fleet.gst = gst[0].filename;
  fleet.tradeliscence = tradelisc[0].filename;
  fleet.ghmcpermission=ghmcper[0].filename
  fleet.cancelcheque=cancelcheq[0].filename
  await fleet.save();
  res.json({ status: "success" });
});

export const getAllFleet = getAll(Fleet);

export const deleteFleet = deleteOne(Fleet);
export const updateFleet = updateOne(Fleet);
export const findOneFleet = findOne(Fleet);
