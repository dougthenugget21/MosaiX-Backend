const { Router } = require('express');

const userprofileController = require('../controller/userprofile');

const userprofileRouter = Router();
userprofileRouter.get("/userid/:id", userprofileController.getUserDetailsbyID)
userprofileRouter.get("/profileid/:id", userprofileController.getUserDetailsbyProfileID)
userprofileRouter.post("/login", userprofileController.getUserDetailsbyEmail);
userprofileRouter.post("/create", userprofileController.createUserProfile);
userprofileRouter.patch("/:id", userprofileController.updateUserProfile);
userprofileRouter.delete("/:id", userprofileController.deleteUser);

module.exports = userprofileRouter;
