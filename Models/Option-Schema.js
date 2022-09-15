const mongoose = require("mongoose")

const optionSchema = mongoose.Schema({
    answer: {
        type: String,
        required: true,
    },
    correct: {
        type: Boolean,
        required: true,
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date
    }
});

const OptionModel = mongoose.model("Option", optionSchema);
module.exports = OptionModel;