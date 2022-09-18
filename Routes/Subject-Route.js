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

//SHOW ALL Subjects
router.get('/all', async (request, response) => {
    const subject = await SubjectModel.find({})
        .populate("name", "name")
        .populate("quiz", "question option student")
        .populate("owner", "name")

    response.status(200).json(subject);
});

//SHOW A Subject
router.get('/:id', async (request, response) => {
    const subject = await SubjectModel.find({ _id: request.params.id })
        .populate("name", "name")
        .populate({
            path: "quiz", // populate quiz
            populate: {
                path: "option" // in quiz, populate ptions
            }
        })
        .populate("owner", "name")

    response.status(200).json(subject);
});


//CREATE a new Subject
router.post('/add', upload.single('image'), async (request, response) => {
    const { name, owner } = request.body;

    let uploadedFile = request.file;
    if (uploadedFile != undefined) {
        uploadedFile = uploadedFile.filename;
    }
    uploadedFile = 'uploads/' + uploadedFile;
    let imageUrl = process.env.BASE_URL + uploadedFile;
    //console.log(process.env.BASE_URL);
    if (!name || !owner) {
        return response.status(400).send('Input required!');
    }
    //creating document for entered details
    const newSubject = new SubjectModel({
        name,
        owner,
        imageUrl,
    });
    try {
        //saving the doc/order to database collection
        const saveSubject = await newSubject.save();
        await UserModel.updateOne({ _id: owner }, {
            $push: {
                "subject": saveSubject.id,
            }
        });
        response.status(201).send("Subject created with ID: " + saveSubject.id);
    } catch (e) {
        response.status(501).send(e.message)
    }
});


//Delete Subject
router.delete('/delete/:id', async (request, response) => {
    //console.log(request.params.id);
    try {
        await StudentModel.deleteOne({ _id: request.params.id });
        response.status(202).send("Subject DELETED with ID: " + request.params.id);
    } catch (e) {
        response.status(501).send(e.message)
    }
})


module.exports = router;