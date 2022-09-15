const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    ID: {
        type: String,
        default: `OrderID${Math.random().toString(36).substring(2, 13) }`,
        required:true,
    },
    desc: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true,
    },
    orderedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "pending",
        required: true,
    }
});

const OrderModel = mongoose.model("Order", orderSchema);
module.exports = OrderModel;