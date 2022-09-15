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

//SHOW ALL Restaurant
router.get('/all', async (request, response) => {
    const restaurants = await RestaurantModel.find({})
        .populate("dishes", "name")
        .populate("buyers", "name")
        .populate("orders", "ID")

    response.status(200).json(restaurants);
});


//CREATE a new Restaurant
router.post('/add', upload.single('image'), async (request, response) => {
    const { name, cuisine, address } = request.body;

    // let uploadedFile = request.file.filename;
    // uploadedFile = 'uploads/' + uploadedFile;
    // let imageUrl = process.env.BASE_URL + uploadedFile;
    //console.log(process.env.BASE_URL);
    //console.log(imageUrl);
    if (!name) {
        return response.status(400).send('Input required!');
    }
    //creating document/Ads for entered details
    const newRest = new RestaurantModel({
        name,
        cuisine,
        address,
    });

    try {
        //saving the doc to database collection
        const saveRest = await newRest.save();
        response.status(201).send("Restaurant created with ID: " + saveRest.id);

    } catch (e) {
        response.status(501).send(e.message)
    }
});


//Delete Restaurant
router.delete('/delete/:id', async (request, response) => {
    //console.log(request.params.id);
    try {
        await RestaurantModel.deleteOne({ _id: request.params.id });
        response.status(202).send("Restaurant DELETED with ID: " + request.params.id);
    } catch (e) {
        response.status(501).send(e.message)
    }
})

//SHOW a Restaurant
router.get('/:id', async (request, response) => {
    const restaurant = await RestaurantModel.find({ _id: request.params.id })
        .populate("dishes", "name")
        .populate("buyers", "name")
        .populate("orders", "ID")

    response.status(200).json(restaurant);
});




//Dishes Add
router.post('/:id/add-dish', upload.single('image'), async (request, response) => {
    const { name, desc, price } = request.body;
    // let uploadedFile = request.file.filename;
    // uploadedFile = 'uploads/' + uploadedFile;
    // let imageUrl = process.env.BASE_URL + uploadedFile;
    //console.log(process.env.BASE_URL);
    //console.log(imageUrl);
    if (!name || !price) {
        return response.status(400).send('Input required!');
    }
    //creating documentfor entered details
    const newDish = new DishModel({
        name,
        desc,
        price,
        restaurant: request.params.id,
    });
    try {
        const saveDish = await newDish.save();
        //response.status(201).send("Dish created with ID: " + saveDish.id);

        await RestaurantModel.updateOne({ _id: request.params.id }, {
            $push: {
                "dishes": saveDish.id,
            }
        });

        response.status(202).send("Dish added with ID: " + saveDish.id);
    } catch (e) {
        response.status(501).send(e.message)
    }
});


//SHOW Orders by filter Restaurant
router.get('/:id/orders', async (request, response) => {
    //?status=pending
    let state = null;
    try {
        state = request.query.status.toLowerCase();
    } catch (error) {
        console.log(error.message);
    }
    let ordersObj = await RestaurantModel.find({ _id: request.params.id }, { orders: true })
        .populate("orders", "ID price buyer orderedAt status")
        .populate("name", "name")

    if (state != null) {
        ordersObj[0].orders = ordersObj[0].orders.filter((elem) => {
            return elem.status === state;
        })
    }
    response.status(200).json(ordersObj);
});


//SHOW REVENUE by filter Dates
router.get('/:id/revenue', async (request, response) => {
    //?start_date=2022-09-08
    //?end_date=2022-09-08
    let startDate = null;
    try {
        startDate = request.query.start_date;
    } catch (error) {
        console.log(error.message)
    }
    let endDate = new Date();
    if (request.query.end_date != null) {
        endDate = request.query.end_date;
    }
    let revenueObj = await RestaurantModel.find({ _id: request.params.id }, { revenue: true })
        .populate("revenue", "date price")
        .populate("name", "name")

    if (startDate != null) {
        startDate = new Date(startDate).getTime();
        endDate = new Date(endDate).getTime();
        revenueObj[0].revenue = revenueObj[0].revenue.filter((elem) => {
            let currDate = new Date(elem.date).getTime();
            return (currDate >= startDate) && (currDate <= endDate);
        })
    }
    response.status(200).json(revenueObj);
});

module.exports = router;