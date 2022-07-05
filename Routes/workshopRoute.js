import express from "express";
const router = express.Router();

import {
  addWorkshop,
  uploadMiddleware,
  uploadPhotos,
  getAllWorkshop,
  deleteWorkshop,
  updateWorkshop,
  findOneWorkshop,
} from "../Controller/workShopController.js";

router.post("/add", addWorkshop);
router.post("/upload/:id", uploadMiddleware, uploadPhotos);
router.get("/all", getAllWorkshop);
router.delete("/delete/:id", deleteWorkshop);
router.put("/update/:id", updateWorkshop);
router.get("/findOne/:id", findOneWorkshop);

export default router;