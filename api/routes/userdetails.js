const { Router } = require('express');

const userController = require('../controller/userdetails');

const userRouter = Router();

userRouter.post("/create", userController.createUser);
userRouter.post("/login", userController.getUserDetailsbyEmail);

module.exports = userRouter;