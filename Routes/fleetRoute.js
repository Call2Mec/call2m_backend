import express from "express";
const router = express.Router();

import {
  addFleet,
  uploadMiddleware,
  uploadPhotos,
  getAllFleet,
  deleteFleet,
  updateFleet,
  findOneFleet,
} from "../Controller/fleetController.js";

router.post("/add", addFleet);
router.post("/upload/:id", uploadMiddleware, uploadPhotos);
router.get("/all", getAllFleet);
router.delete("/delete/:id", deleteFleet);
router.put("/update/:id", updateFleet);
router.get("/findOne/:id", findOneFleet);

export default router;