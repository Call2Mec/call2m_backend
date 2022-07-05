import express from "express";
import cors from "cors";
const app = express();

// controller
import authRouter from "./Routes/authRoute.js";
import globalErrorHandler from "./Controller/errorController.js";
import bookingRoutes from "./Routes/bookingRoute.js";
import userRoutes from "./Routes/userRoute.js";
import workShopRoutes from "./Routes/workshopRoute.js";
import fleetRoutes from "./Routes/fleetRoute.js";
import vehicleRoute from "./Routes/vehicleRoute.js";
import supportRoute from "./Routes/supportRoute.js";
import staffRoute from "./Routes/staffRoute.js";

//parser setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({limit: '50mb', extended: true}));


app.get("/",(req,res)=>{
    res.json({message:"amol"})
})

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/booking", bookingRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/workshop", workShopRoutes);
app.use("/api/v1/fleet", fleetRoutes);
app.use("/api/v1/vehicle", vehicleRoute);
app.use("/api/v1/support", supportRoute);
app.use("/api/v1/staff", staffRoute);

//ERROR HANDLE MIDDLEWARE
app.use(globalErrorHandler);


export default app;
