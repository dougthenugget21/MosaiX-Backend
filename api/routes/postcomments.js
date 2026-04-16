const { Router } = require('express');

const postcommentsController = require('../controller/postcomments');

const postcommentRouter = Router();
postcommentRouter.get("/allcomments/:id", postcommentsController.getCommentsbyPostID)
postcommentRouter.get("/:id", postcommentsController.getCommentbyID)
postcommentRouter.post("/add", postcommentsController.createComment);
postcommentRouter.patch("/:id", postcommentsController.updateComment);
postcommentRouter.delete("/:id", postcommentsController.deleteComment);

module.exports = postcommentRouter;
