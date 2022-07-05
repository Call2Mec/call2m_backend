import User from "../Model/UserModel.js";
import nodemailer from "nodemailer";
import {
  getAll,
  updateOne,
  deleteOne,
  findOne,
  createOne,
} from "./handleFactory.js";
import catchAssync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import otp from "../Model/otp.js";

export const AllUser = getAll(User);

export const updateOneUser = updateOne(User, "User");

export const deleteOneUser = deleteOne(User);

export const actDeacUser = catchAssync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id).select("+active");
  console.log(user);
  if (!user) {
    return next(new AppError("No user found", 401));
  }

  if (user.role === "admin") {
    return next(new AppError("Cant activate the user", 401));
  }

  user.active = !user.active;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ status: "success" });
});

export const createUser = createOne(User);

export const findOneUser = findOne(User);
//Md added this funcitons--------------------------------
export const otpEmailSend = async (req, res) => {
  console.log(req.body.email);
  const data = await User.findOne({ email: req.body.email });
  const responseType = {};
  if (data) {
    let otpcode = Math.floor(Math.random() * 1000000 + 1);
    let otpData = new otp({
      email: req.body.email,
      otp: otpcode,
      expireIn: new Date().getTime() + 300 * 1000,
    });

    let otpResponse = await otpData.save();
    responseType.statusText = "Success";
    mailer(req.body.email, otpcode);
    responseType.message = "please check your email id";
  } else {
    responseType.statusText = "error";
    responseType.message = "email id does not exsist";
  }
  res.status(200).json(responseType);
};
// node mailer---------------------------------
const mailer = (email, otp) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: "email.ney.vai@gmail.com",
      pass: "email@420",
    },
  });
  const mail = {
    from: "'C2M' <email.ney.vai@gmail.com>",
    to: email,
    subject: "Otp for passward change",

    text: `Here is your otp: ${otp}`,
  };
  transporter.sendMail(mail, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
    }
  });
};
// New password change---------------------------------
export const newPassword = async (req, res) => {
  let data = await otp.find({ email: req.body.email, otp: req.body.otp });
  const response = {};
  if (data) {
    let currentTime = new Date().getTime();
    let diff = data.expireIn - currentTime;
    if (diff < 0) {
      response.message = "Token Expire";
      response.statusText = "error";
    } else {
      let user = await User.findOne({ email: req.body.email });
      user.password = req.body.password;
      user.passwordConfirm = req.body.passwordConfirm;
      user.save();

      console.log(user);
      response.message = "Password changed successfully";
      response.statusText = "Success";
    }
  } else {
    response.message = "Invalid Otp";
    response.statusText = "error";
  }
  res.status(200).json(response);
};
