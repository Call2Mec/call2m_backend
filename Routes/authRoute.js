import express from "express";
const router = express.Router();

import {
  signup,
  signin,
  forgotPassword,
  protect,
  changePassword,
  resetPassword,
  restrictTo,
  logout,
} from "../Controller/authController.js";

router.post("/sign-up", signup);
router.post("/sign-in", signin);
router.post(
  "/change-password",
  protect,
  restrictTo(["admin", "finance", "staff"]),
  changePassword
);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get(
  "/log-out",
  protect,
  restrictTo(["admin", "finance", "staff"]),
  logout
);

export default router;
