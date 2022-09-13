require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");

const DB_URL = process.env.DB_URL;