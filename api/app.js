const express = require('express');
const cors = require('cors');

const userDetailsRouter = require('./routes/userdetails');
const postRouter = require('./routes/userPosts')

const api = express();

api.use(cors());
api.use(express.json());

api.use("/userData", userDetailsRouter);
api.use("/posts", postRouter)



module.exports = api;