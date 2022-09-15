const mongoose = require("mongoose")

const studentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        default: 0,
        required: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    response: [{
        type: Object,
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const StudentModel = mongoose.model("Student", studentSchema);
module.exports = StudentModel;