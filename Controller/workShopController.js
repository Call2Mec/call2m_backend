import Workshop from "../Model/workshopModel.js";
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

export const addWorkshop = catchAssync(async (req, res, next) => {
  const { name, phone, email, state, city ,alternateNumber} = req.body;
  const workshop = await Workshop.create({
    name,
    phoneNo: [phone,alternateNumber],
    email,
    state,
    city,
  });
  res.status(200).json({ statue: "success", data: workshop });
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

  const workshop = await Workshop.findById(id);
  if (!workshop) {
    return next(new AppError("no workshop found", 400));
  }
  workshop.addressProof = address[0].filename;
  workshop.vucProof = vuc[0].filename;
  workshop.aadhar = aadhar[0].filename;
  workshop.pan = pan[0].filename;
  workshop.gst = gst[0].filename;
  workshop.tradeliscence = tradelisc[0].filename;
  workshop.ghmcpermission=ghmcper[0].filename
  workshop.cancelcheque=cancelcheq[0].filename
  await workshop.save();
  res.json({ status: "success" });
});

export const getAllWorkshop = getAll(Workshop);

export const deleteWorkshop = deleteOne(Workshop);
export const updateWorkshop = updateOne(Workshop);
export const findOneWorkshop = findOne(Workshop);
