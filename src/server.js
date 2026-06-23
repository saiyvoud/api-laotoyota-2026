import express from "express";
import './config/db_mysql.js';
import cors from "cors";
import router from "./router/index.js";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import "./cron/deleteOldTimeFix.js";
const app = express();
app.use(cors());
app.use(fileUpload())
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "500mb", parameterLimit: 5000 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "500mb", parameterLimit: 5000 }));
app.use("/api", router);
app.listen(8000, () => {
    console.log(`http://localhost:8000`);
})