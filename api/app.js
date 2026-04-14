const express = require('express');
const cors = require('cors');

const userDetailsRouter = require('./routes/userdetails');

const api = express();

api.use(cors());
api.use(express.json());

api.use("/user", userDetailsRouter);

module.exports = api;