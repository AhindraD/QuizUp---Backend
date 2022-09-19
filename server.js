require("dotenv").config();
const { Server } = require("socket.io");
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
    useUnifiedTopology: true
}
mongoose.connect(DB_URL, DB_Options)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("ERROR: ", err))


//ALL ROUTES import
const authRouter = require("./Routes/Auth-Route");
const quizRouter = require("./Routes/Quiz-Route");
const subjectRouter = require("./Routes/Subject-Route");
const studentRouter = require("./Routes/Student-Route");
const teacherRouter = require("./Routes/Teacher-Route");

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
app.use("/teacher", authenticateRequest, teacherRouter);

const httpServer = app.listen(process.env.PORT || 8000, () => {
    const port = httpServer.address().port;
    console.log(`Server running on ${port}`);
});


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


//SOCKET_IO
const io = new Server(httpServer);
let allRooms = {};
/*
roomDemoID:{
            teacher: "abc",
            roomID: "roomDemoID",
            subjectID: "subjectID",
            quizArr: [],
            studentsArr: [],
            reportArr: [],
            status: "started/pending",
},
*/

io.on("connection", (socket) => {
    console.log("Client Connected: ", socket.id);
    socket.emit("ID", socket.id);

    //CREATE ROOM
    socket.on("create-room", (data) => {
        //"create-room", { roomID: randomK, owner: socket.id, quizArr: resp.data[0].quiz, subjectID }
        allRooms[data.roomID] = {
            teacher: data.owner,
            roomID: data.roomID,
            subjectID: data.subjectID,
            quizArr: data.quizArr,
            studentsArr: [],
            reportArr: [],
            status: "pending",
        };
        socket.join(data.roomID);
        io.to(data.owner).emit("room-created", allRooms[data.roomID])
    })

    //JOIN ROOM
    socket.on("join-room", (data) => {
        //"join-room", { roomID, name, joiner: socket.id }
        if (allRooms[data.roomID] !== undefined) {
            //console.log("student-connected");
            allRooms[data.roomID].studentsArr.push(data.name);
            let newStudent = { student: data.name, studentID: joiner, answers: [], score: 0 }
            allRooms[data.roomID].reportArr.push(newStudent);
            socket.join(data.roomID);
            setTimeout(() => {
                io.to(data.roomID).emit("room-joined", newStudent);
            }, 100);//delaying to gove time to set the socket on, inside useEffect (frontend) on page load
        } else {
            console.log("Invalid Room!");
            socket.emit("join-access", { valid: false, resp: "Invalid Room!" });
        }
    })

    //QUIZ_PROCESS
    socket.on("start-game", (data) => {
        //"start-game", { roomID }
        allRooms[data.roomID].status = "started";
        io.to(data.roomID).emit("game-started", data);
    })

    socket.on("change-quiz", (data) => {
        io.to(data.roomID).emit("quiz-changed", data);
    })

    socket.on("give-answer", (data) => {
        io.to(data.roomID).emit("student-answered", data);
    })

    socket.on("end-game", (data) => {
        io.to(data.roomID).emit("game-ended", allRooms[data.roomID]);
    })


    socket.on("disconnect", () => {
        console.log(`Client Disconnected: `, socket.id);
    });
})