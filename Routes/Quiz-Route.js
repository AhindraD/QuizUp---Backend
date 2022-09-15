const express = require('express');
const UserModel = require('../Models/User-Schema');
const QuizModel = require('../Models/Quiz-Schema');
const OptionModel = require('../Models/Option-Schema');
const SubjectModel = require('../Models/Subject-Schema');
const StudentModel = require('../Models/Student-Schema');
const multer = require("multer");
const router = express.Router();


const storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, "public/uploads")
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + Math.random().toString(32).slice(2, 13) + "-" + file.originalname)
        }
    }
);

const upload = multer({ storage: storage });

//SHOW all Quiz
router.get('/all', async (request, response) => {
    const quiz = await QuizModel.find({})
        .populate("question", "question")
        .populate("option", "answer correct")
        .populate("subject", "name")
        .populate("owner", "name")

    response.status(200).json(quiz);
});

//SHOW a Quiz
router.get('/:id', async (request, response) => {
    const quiz = await QuizModel.find({ _id: request.params.id })
        .populate("question", "question")
        .populate("option", "answer correct")
        .populate("subject", "name")
        .populate("owner", "name")

    response.status(200).json(quiz);
});


//Create a Quiz & Add
router.post('/add', upload.single('image'), async (request, response) => {
    const { question, option, subject, owner } = request.body;

    let uploadedFile = request.file.filename;
    uploadedFile = 'uploads/' + uploadedFile;
    let imageUrl = process.env.BASE_URL + uploadedFile;
    //console.log(process.env.BASE_URL);
    console.log(imageUrl);
    if (!question || !option || !subject || !owner) {
        return response.status(400).send('Input required!');
    }
    //creating document for entered details
    const newQuiz = new QuizModel({
        question,
        option,
        subject,
        owner,
        imageUrl,
    });
    try {
        //saving the doc/order to database collection
        const saveQuiz = await newQuiz.save();
        await SubjectModel.updateOne({ _id: subject }, {
            $push: {
                "quiz": saveQuiz.id,
            }
        });
        await UserModel.updateOne({ _id: owner }, {
            $push: {
                "quiz": saveQuiz.id,
            }
        });
        response.status(201).send("Quiz created with ID: " + saveQuiz.id);
    } catch (e) {
        response.status(501).send(e.message)
    }
});

//Delete Quiz
router.delete('/delete/:id', async (request, response) => {
    //console.log(request.params.id);
    try {
        await QuizModel.deleteOne({ _id: request.params.id });
        response.status(202).send("Quiz DELETED with ID: " + request.params.id);
    } catch (e) {
        response.status(501).send(e.message)
    }
})

module.exports = router;