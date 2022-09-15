const mongoose = require("mongoose")

const quizSchema = mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    option: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Option',
    }],
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    student: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date
    },
    imageUrl: {
        type: String
    }
});

const QuizModel = mongoose.model("Quiz", quizSchema);
module.exports = QuizModel;