const { Router } = require('express');

const profiledetailsController = require('../controller/profiledetails');
const { profile } = require('node:console');

const profileDetailsRouter = Router();
profileDetailsRouter.get("/userid/:id", profiledetailsController.getProfileDetailsbyUserID)
profileDetailsRouter.get("/profileid/:id", profiledetailsController.getProfileDetailsbyProfileID)
profileDetailsRouter.post("/create", profiledetailsController.createProfile);
profileDetailsRouter.patch("/:id", profiledetailsController.updateProfile);
profileDetailsRouter.delete("/:id", profiledetailsController.deleteProfile);

module.exports = profileDetailsRouter;