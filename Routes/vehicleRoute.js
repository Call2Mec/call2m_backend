import express from "express";
const router = express.Router();

import {
  addVehicle,
  uploadPhotos,
  uploadMiddleware,
  allVehicle,
  deleteVehicle,
  updateVehicle,
} from "../Controller/vehicleController.js";

router.post("/add", addVehicle);
router.post("/upload/:id", uploadMiddleware, uploadPhotos);
router.get("/all", allVehicle);
router.delete("/delete/:id", deleteVehicle);
router.put("/update/:id", updateVehicle);
// chandan created route 

export default router;
