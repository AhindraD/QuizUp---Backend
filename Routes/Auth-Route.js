const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../Models/User-Schema");

const router = express.Router();

//SIGN_UP
router.post("/signup", async (request, resonse) => {
    const { name, email, password, confirmPassword } = request.body;
    //Input Validation
    if (!name || !email || !password || !confirmPassword) {
        return resonse.status(400).send("All fields are REQUIRED!");
    }
    if (password !== confirmPassword) {
        return resonse.status(400).send("Password & ConfirmPassword is not same!");
    }
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser != null) {
        return resonse.status(409).send("Email already exists!");
    }

    //DATA_PROCESS
    //Generate password HASH
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    //Create new user
    const newUser = new UserModel({
        name,
        email,
        password: hash,
    })
    try {//Adding new user to Database
        const saveUser = await newUser.save();
        return resonse.status(201).send("Teacher created with ID: " + saveUser.id);
    } catch (error) {
        return resonse.status(501).send("ERROR: " + error.message);
    }
})

module.exports = router;