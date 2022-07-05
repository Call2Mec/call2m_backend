import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import app from "./app.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 3018;
const DB_URL = process.env.DB_URL + process.env.DB_NAME;

const DB_URI = `mongodb+srv://call2mechanic:NDhnSlJHK6dDlKaA@cluster0.depssen.mongodb.net/mechanic?retryWrites=true&w=majority`;
mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("database connected");
    app.listen(PORT, () => {
      console.log(`Server is up and running on Port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Erro while connecting" + err);
  });
