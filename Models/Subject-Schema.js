const mongoose = require("mongoose");

const subjectSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    quiz: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
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

const SubjectModel = mongoose.model("Subject", subjectSchema);
module.exports = SubjectModel;