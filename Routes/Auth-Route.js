const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../Models/User-Schema");

const router = express.Router();

//SIGN_UP
router.post("/signup", async (request, response) => {
    const { name, email, password, confirmPassword } = request.body;
    //Input Validation
    if (!name || !email || !password || !confirmPassword) {
        return response.status(400).json({ error: "All fields are REQUIRED!"});
    }
    if (password !== confirmPassword) {
        return response.status(400).json({ error: "Password & ConfirmPassword is not same!"});
    }
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser != null) {
        return response.status(409).json({ error: "Email already exists!"});
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
        return response.status(201).send("Teacher created with ID: " + saveUser.id);
    } catch (error) {
        return response.status(501).send("ERROR: " + error.message);
    }
});

const REFRESH_TOKENS = [];
//LOG_IN
router.post("/login", async (request, response) => {
    const { email, password } = request.body;
    //Input Validation
    if (!email || !password) {
        return response.status(400).json({ error: "All fields are REQUIRED!"});
    }
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser == null) {
        return response.status(404).json({ error: "Email doesn't exist!"});
    }

    //Hashed Password compare
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
        return response.status(401).json({ error: "Incorrect Password! try again..." });
    }
    const payload = {
        id: existingUser.id,
        email: existingUser.email
    }
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME });
    REFRESH_TOKENS.push(refreshToken);

    return response.status(202).json({ accessToken, refreshToken, existingUser })
});

//Generate Access token from Refresh Token
router.post("/token", async (request, response) => {
    //Veryfying token received
    const refreshToken = request.body.token;
    if (!refreshToken) {
        return response.status(401).json({ error: "Please provide token!"})
    }
    // if (!REFRESH_TOKENS.includes(refreshToken)) {//NO_NEED: done by jwt.verify
    //     return response.status(403).send("Invalid token provided!");
    // }
    //Generating Access token
    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        delete payload.exp;
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME });
        return response.status(202).json({ accessToken });
    } catch (error) {
        return response.status(401).send("ERROR: " + error.message);
    }
});


module.exports = router;