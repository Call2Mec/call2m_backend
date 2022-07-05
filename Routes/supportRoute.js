import express from "express";

const router = express.Router();
import {
  addComplain,
  changeStatus,
  getAll,
  deletById,
  getUserComplain,
} from "../Controller/supportController.js";

router.post("/add", addComplain);
router.get("/user", getUserComplain);

router.get("/all", getAll);
router.get("/changeStatus/:Id", changeStatus);
router.delete("/delete/:Id", deletById);

export default router;
