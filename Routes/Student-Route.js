const express = require('express');
const UserModel = require('../Models/User-Schema');
const QuizModel = require('../Models/Quiz-Schema');
const OptionModel = require('../Models/Option-Schema');
const SubjectModel = require('../Models/Subject-Schema');
const StudentModel = require('../Models/Student-Schema');
const multer = require("multer");
const router = express.Router();


//SHOW ALL Subjects
router.get('/subject/all', async (request, response) => {
    const subject = await SubjectModel.find({})
        .populate("name", "name")
        .populate("quiz", "question option")
        .populate("owner", "name")

    response.status(200).json(subject);
});

//SHOW A Subject
router.get('/subject/:id', async (request, response) => {
    const subject = await SubjectModel.find({ _id: request.params.id })
        .populate("name", "name")
        .populate("quiz", "question option")
        .populate("owner", "name")

    response.status(200).json(subject);
});

//SHOW all Quiz
router.get('/quiz/all', async (request, response) => {
    const quiz = await QuizModel.find({})
        .populate("question", "question")
        .populate("option", "answer")
        .populate("subject", "name")
        .populate("owner", "name")

    response.status(200).json(quiz);
});

//SHOW a Quiz
router.get('/quiz/:id', async (request, response) => {
    const quiz = await QuizModel.find({ _id: request.params.id })
        .populate("question", "question")
        .populate("option", "answer")
        .populate("subject", "name")
        .populate("owner", "name")

    response.status(200).json(quiz);
});

//Student Join
router.post('/:teacherID/join', async (request, response) => {
    const { name } = request.body;
    //creating document for entered details
    //console.log(request.params.teacherID);
    if (!name) {
        return response.status(400).send('Input required!');
    }
    const newStudent = new StudentModel({
        name,
    });
    try {
        //saving the doc/order to database collection
        const saveStudent = await newStudent.save();
        await UserModel.updateOne({ _id: request.params.teacherID }, {
            $push: {
                "student": saveStudent.id,
            }
        });
        response.status(201).send("Student created with ID: " + saveStudent.id);
    } catch (e) {
        response.status(501).send(e.message)
    }
});

//Give Answer
router.post('/answer/:quizID', async (request, response) => {
    const { student, option } = request.body;
    //creating document for entered details
    if (!student || !option) {
        return response.status(400).send('Input required!');
    }
    let opt = await OptionModel.find({ _id: option });
    let ifCorrect = opt[0].correct;
    const chosenOpt = new OptionModel({
        answer: option,
        correct: ifCorrect,
        quiz: request.params.quizID
    });
    try {
        await StudentModel.updateOne({ _id: student }, {
            $push: {
                "response": chosenOpt,
            }
        });
        if (ifCorrect) {
            let currStudent = await StudentModel.find({ _id: student });
            let currPoint = currStudent[0].score;
            await StudentModel.updateOne({ _id: student }, {
                "score": currPoint + 1,
            });
        }
        response.status(201).send("Response received is correct? - " + ifCorrect);
    } catch (e) {
        response.status(501).send(e.message)
    }
});


module.exports = router;