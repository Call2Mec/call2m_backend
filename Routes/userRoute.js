import express from "express";
const router = express.Router();

import {
  AllUser,
  updateOneUser,
  deleteOneUser,
  actDeacUser,
  findOneUser,
  createUser,newPassword,otpEmailSend
} from "../Controller/userController.js";

import { protect, restrictTo, changePassword } from "../Controller/authController.js";

router.get("/all", AllUser);
router.post("/add", createUser);
router.put("/update/:id", updateOneUser);
router.delete("/delete/:id", deleteOneUser);
router.get("/actdeact/:id", protect, restrictTo(["admin"]), actDeacUser);
router.get("/findOne/:id", findOneUser);
router.post("/sendOtpEmail", otpEmailSend);
router.post("/change-password", newPassword);

export default router;
