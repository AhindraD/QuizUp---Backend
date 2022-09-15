const mongoose = require("mongoose")

const optionSchema = mongoose.Schema({
    answer: {
        type: String,
        required: true,
    },
    correct: [{
        type: Boolean,
        required: true,
    }],
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const OptionModel = mongoose.model("Option", optionSchema);
module.exports = OptionModel;