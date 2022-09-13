const mongoose = require("mongoose");

const USER_SCHEMA = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    quiz: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    imageURL: {
        type: String,
    }
});

const UserModel = mongoose.model("User", USER_SCHEMA);
module.exports = UserModel;