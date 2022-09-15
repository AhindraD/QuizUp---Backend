const mongoose = require("mongoose")

const studentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    response: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Option',
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const StudentModel = mongoose.model("Student", studentSchema);
module.exports = StudentModel;