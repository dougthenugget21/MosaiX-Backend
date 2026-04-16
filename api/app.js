const express = require('express');
const cors = require('cors');

const userDetailsRouter = require('./routes/userdetails');
const profileDetailsRouter = require('./routes/profiledetails');
const userProfileRouter = require('./routes/userprofile');
const commentRouter = require('./routes/postcomments')

const api = express();

api.use(cors());
api.use(express.json());

api.use("/userData", userDetailsRouter);
api.use("/profileData", profileDetailsRouter);
api.use("/userProfile", userProfileRouter)
api.use("/comment",commentRouter)

module.exports = api;