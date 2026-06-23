import express from "express";
import './config/db_mysql.js';
import cors from "cors";
import router from "./router/index.js";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import "./cron/deleteOldTimeFix.js";
const app = express();
const allowedOrigins = ['https://webadmin.laotoyotaservice.la', 'http://localhost:5173'];

app.use(cors({
    origin: function(origin, callback){
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(fileUpload())
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "500mb", parameterLimit: 5000 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "500mb", parameterLimit: 5000 }));
app.use("/api", router);
app.listen(8000, () => {
    console.log(`http://localhost:8000`);
})