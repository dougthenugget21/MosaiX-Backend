const express = require('express');
const cors = require('cors');

const userDetailsRouter = require('./routes/userdetails');
const profileDetailsRouter = require('./routes/profiledetails');

const api = express();

api.use(cors());
api.use(express.json());

api.use("/userData", userDetailsRouter);
api.use("/profileData", profileDetailsRouter);

module.exports = api;