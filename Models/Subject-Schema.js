const mongoose = require("mongoose");

const subjectSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    cuisine: {
        type: String,
    },
    address: {
        type: String,
    },
    revenue: [
        {
            type: Object,
        }
    ],
    dishes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dish",
        }
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        }
    ],
    buyers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
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

const SubjectModel = mongoose.model("Subject", subjectSchema);
module.exports = SubjectModel;