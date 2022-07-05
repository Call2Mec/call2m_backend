import AppError from "../utils/appError.js";
const validEmail = () => {
  return new AppError("Please Enter a valid email", 400);
};

const duplicateError = (error) => {
  const message = "Email Already Exist ! try using other email";

  return new AppError(message, 400);
};

const passwordMissmatch = () => {
  return new AppError("Password and confirm password are not same", 400);
};

const errorHandler = (err, req, res, next) => {
  let error = err.message || "Internal Server Error";
  let statusCode = err.statusCode || "500";
  if (
    err.message === "User validation failed: email: Please enter a valid email"
  ) {
    error = validEmail().message;
    statusCode = validEmail().statusCode;
  }
  if (err.code === 11000) {
    error = duplicateError().message;
    statusCode = duplicateError().statusCode;
  }
  if (err.message === "jwt malformed") {
    error = "Invalid json web token";
    statusCode = 400;
  }
  if (
    err.message ===
    "User validation failed: passwordConfirm: Passwords are not the same"
  ) {
    error = passwordMissmatch().message;
    statusCode = passwordMissmatch().statusCode;
  }

  if (process.env.NODE_ENV === "production") {
    res.status(statusCode).json({ status: "error", message: error });
  } else {
    console.log(err);
    res
      .status(statusCode)
      .json({ status: "error", message: err, stack: err.stack });
  }
};

export default errorHandler;
