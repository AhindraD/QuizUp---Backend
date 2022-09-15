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
const authRouter = require("./Routes/Auth-Route");
const quizRouter = require("./Routes/Quiz-Route");
const subjectRouter = require("./Routes/Subject-Route");
const studentRouter = require("./Routes/Student-Route");

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
app.use("/auth", authRouter);
app.use("/student", studentRouter);
//custom Auth middleware for data protection
app.use("/quiz", authenticateRequest, quizRouter);
app.use("/subject", authenticateRequest, subjectRouter);

app.listen(process.env.PORT || 8000);


//AUTHORIZATION: custom middleware to prevent un-authorized access
function authenticateRequest(request, response, next) {
    const authHeaderInfo = request.headers["authorization"];
    if (authHeaderInfo == undefined) {
        return response.status(401).send("No token is provided!");
    }
    const token = authHeaderInfo.split(" ")[1];//Bearer <token>
    if (token == undefined) {
        return response.status(401).send("Proper token is NOT provided!");
    }
    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        request.userInfo = payload;
        //console.log(request.userInfo);
        next();
    } catch (error) {
        return response.status(401).send("Invalid token provided! ERROR: " + error.message);
    }
}