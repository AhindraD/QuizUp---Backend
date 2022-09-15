const express = require('express');
const UserModel = require('../Models/User-Schema');
const QuizModel = require('../Models/Quiz-Schema');
const OptionModel = require('../Models/Option-Schema');
const SubjectModel = require('../Models/Subject-Schema');
const StudentModel = require('../Models/Student-Schema');
const multer = require("multer");
const router = express.Router();

//show All MY Students
router.get('/allStudents', async (request, response) => {
    const { teacherID } = request.body;
    if (!teacherID) {
        return response.status(400).send('Input required!');
    }
    const students = await StudentModel.find({ teacher: teacherID })
        .populate("teacher", "name");
    response.status(200).json(students);
});

module.exports = router;