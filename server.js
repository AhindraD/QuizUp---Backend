require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const rfs = require("rotating-file-stream");


//CONNECTING to MongoDB
const DB_URL = process.env.DB_URL;
const DB_Options = {
    useNewURLParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
}
mongoose.connect(DB_URL, DB_Options)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("ERROR: ", err))


//ALL ROUTES import



const app = express();
//MIddleWares
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({}));
// Logger to show logs in console 
app.use(morgan("dev"));
// add log stream to morgan to save logs in file
const stream = rfs.createStream("file.log", {
    size: "10M", // rotate every 10 MegaBytes written
    interval: "1d", // rotate daily
    compress: "gzip" // compress rotated files
});
app.use(morgan("dev", { stream }));


//Routes related USAGE



app.listen(process.env.PORT || 8000);


//AUTHORIZATION: custom middleware to prevent un-authorized access