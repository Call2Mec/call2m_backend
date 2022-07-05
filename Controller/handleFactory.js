import CatchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
// creating  generic function for some action like delete.. etc to avoid repetitions of code
export const deleteOne = (Model) =>
  CatchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

export const updateOne = (Model, type=undefined) =>
  CatchAsync(async (req, res, next) => {

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const createOne = (Model, type = undefined) =>
  CatchAsync(async (req, res, next) => {
    if (type === "vehicle") {
      const count = await Model.find();

      req.body.customerID = +(count.length + 1);
    }
    const newDoc = await Model.create(req.body);
    res.status(201).json({
      status: "Success",
      data: newDoc,
    });
  });

// module.exports.getOne = (Model, populateOptions) =>
//   catchAsync(async (req, res, next) => {
//     let query = Model.findById(req.params.id);
//     if (populateOptions) {
//       query = query.populate(populateOptions);
//     }
//     const doc = await query;
//     if (!doc) {
//       return next(new AppError("No document found with that ID", 404));
//     }
//     res.status(200).json({
//       status: "success",
//       data: { doc },
//     });
//   });

export const getAll = (Model) =>
  CatchAsync(async (req, res, next) => {

    let filter = {};
    if (req.query.status) {
      filter = { status: req.query.status };
    }

    if (req.query.bookingID) {
      filter = { booking_ID: req.query.bookingID };
    }
    if (req.query.role) {
      filter = { role: req.query.role };
    }
    if (req.query.state) {
      filter = { role: req.query.state };
    }
    if (req.query.city) {
      filter = { role: req.query.city };
    }
    if (req.query.workshop) {
      filter = { _id: req.query.workshop };
    }
    if (req.query.vehicle) {
      filter = { vehicle_details: req.query.vehicle };
    }
    if (req.query.bWorkshop) {
      filter = { Workshop: req.query.bWorkshop };
    }
    if (req.query.bUser) {
      filter = { assignedTo: req.query.bUser };
    }
    if (req.query.vID) {
      filter = { booking_ID: req.query.vID };
    }
    if (req.query.vcid) {
      filter = { customerID: req.query.vcid };
    }
    if (req.query.cvrn) {
      filter = { registrationNo: req.query.cvrn };
    }
    if (req.query.id) {
      filter = { _id: req.query.id };
    }

    if (req.query.assignedTo) {
      filter = { ...filter,assignedTo:req.query.assignedTo};
    }
    //Exequting query
    const alldoc = await Model.find(filter);

    // sending response
    res.status(200).json({
      status: "success",
      count: alldoc.length,
      data: alldoc,
    });
  });

  export const findOne = (Model, type) =>
  CatchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });