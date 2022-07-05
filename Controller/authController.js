import CatchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import User from "../Model/UserModel.js";
import JWT from "jsonwebtoken";
import { promisify } from "util";
import Email from "../utils/email.js";
import crypto from "crypto";

const createToken = (id) =>
  JWT.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
const createSendToken = (user, statusCode, req, res) => {
  const token = createToken(user._id);
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.header("x-forwarded-proto") === "https",
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: "Success",
    token,
    user,
  });
};

export const signup = CatchAsync(async (req, res, next) => {
  try {
    console.log("send data",req.body)
    const { name, email, phone, password, passwordConfirm } = req.body;

    const user = await User.create({
      name,
      email,
      phone: +phone,
      password,
      passwordConfirm,
    });
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
});

export const signin = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  // 2) check if the user exist && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) if every thing is okay send JWT to client
  createSendToken(user, 200, req, res);
});

export const forgotPassword = CatchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("No user exist with that email address", 404));
  }
  // 2) generate the random  reset token
  const resetToken = user.creatPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    await new Email(user.email).sendResetToken(
      `Your password reset OTP is ${resetToken} which is valid for 10 min only`
    );

    res
      .status(200)
      .json({ status: "success", message: "Please Check your email for OTP" });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return new AppError(
      "there was an error sending email. try again later",
      500
    );
  }
});

export const changePassword = CatchAsync(async (req, res, next) => {
  const { old_pass, new_pass, conf_pass } = req.body;
  const { user } = req;

  if (!(await user.correctPassword(old_pass, user.password))) {
    return next(new AppError("Incorrrect Password", 400));
  }
  //3)if so update password
  user.password = new_pass;
  user.passwordConfirm = conf_pass;
  await user.save();
  //4) log user in send token
  createSendToken(user, 200, req, res);
});

export const resetPassword = CatchAsync(async (req, res, next) => {
  // 1) get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) if token is valid and user exist ,set new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  if (req.body.password !== req.body.passwordConfirm) {
    return next(
      new AppError("Password and confirm password are not same", 400)
    );
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //3) update changePasswordAt prop for user
  //4) send JWT to sign in
  createSendToken(user, 200, req, res);
});

export const protect = CatchAsync(async (req, res, next) => {
  // 1) GETTING TOKEN
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not Logged in ! Please log in to get access", 401)
    );
  }

  // 2) VERIFICATION OF TOKEN
  const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);

  if (Date.now() >= decoded.exp * 1000) {
    return next(new AppError("token expired", 401));
  }
  // 3) CHECK IF USER EXISTS
  const freshUser = await User.findById(decoded.id).select("+password");
  if (!freshUser) {
    return next(new AppError("User no longer exist.", 401));
  }
  // 4)CHECK IF USER CHAGED PASSWORD AFTER ISSUING THE TOKEN
  if (freshUser.changedPassworedAfter(decoded.iat)) {
    return next(
      new AppError("Password was recently changed ! please login again", 401)
    );
  }

  req.user = freshUser;
  res.locals.user = freshUser;

  next();
});

export const restrictTo = (roles) => (req, res, next) => {
  // roles is an array
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError("Yo do not have permission to perform this action", 403)
    );
  }
  next();
};

export const logout = (req, res) => {
  res.cookie("jwt", "Logged out successfully", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res
    .status(200)
    .json({ status: "success", message: "Logged out successfull" });
};
