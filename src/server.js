import express from "express";
import './config/db_mysql.js';
const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});
app.use(fileUpload())
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "500mb", parameterLimit: 5000 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "500mb", parameterLimit: 5000 }));
app.use("/api", router);
app.listen(8000, () => {
    console.log(`http://localhost:8000`);
})