const express = require('express');
const UserModel = require('../models/user-Schema');
const RestaurantModel = require('../models/restaurants-Schema');
const OrderModel = require('../models/orders-Schema');
const DishModel = require('../models/dishes-Schema');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const router = express.Router();


const storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, "public/uploads")
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname)
        }
    }
);

const upload = multer({ storage: storage });

//show a order
router.get('/:id', async (request, response) => {
    const order = await OrderModel.find({ _id: request.params.id });
    response.status(200).json(order);
});


//place a order
router.post('/add', async (request, response) => {
    const { buyerID, restaurantID, dishId, qnty } = request.body;
    if (!buyerID || !restaurantID || !dishId || !qnty) {
        return response.status(400).send('Input required!');
    }

    let dishPrice = await DishModel.find({ _id: dishId }, {
        price: true
    });

    let price = Number(qnty) * Number(dishPrice[0].price);
    //creating document/Category for entered details
    const newOrder = new OrderModel({
        buyer: buyerID,
        restaurant: restaurantID,
        price,
    });

    try {
        //saving the doc/order to database collection
        const saveOrder = await newOrder.save();
        await RestaurantModel.updateOne({ _id: restaurantID }, {
            $push: {
                "orders": saveOrder.id,
                "revenue": {
                    date: new Date().toISOString().split('T')[0],
                    price: price,
                },
                "buyer": buyerID
            }
        });
        await UserModel.updateOne({ _id: buyerID }, {
            $push: {
                "orders": saveOrder.id,
            }
        });
        response.status(201).send("Order created with ID: " + saveOrder.id);
    } catch (e) {
        response.status(501).send(e.message)
    }
});


//Update order status
router.post('/:id/update', async (request, response) => {
    //console.log(request.params.id);
    //?status=<pending/completed/cancelled>
    let state = null;
    try {
        state = request.query.status.toLowerCase();
    } catch (error) {
        console.log(error.message);
    }
    try {
        await OrderModel.updateOne({ _id: request.params.id }, { status: state });
        response.status(202).send("Order marked " + state.toUpperCase() + " with ID: " + request.params.id);
    } catch (e) {
        response.status(501).send(e.message)
    }
})

module.exports = router;