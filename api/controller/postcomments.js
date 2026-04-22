const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Postcomments = require("../model/Postcomments");

// Get all comments by Post
async function getCommentsbyPostID(req, res) {
  try {
    let post_id = req.params.id;
    const comments = await Postcomments.getCommentsbyPostID(post_id);
    res.status(200).json(comments);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
// Get Comment by ID
async function getCommentbyID(req, res) {
  try {
    let comment_id = req.params.id;
    const comment = await Postcomments.getCommentbyID(comment_id);
    res.status(200).json(comment);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

// Add comment
async function createComment(req, res) {
  try {
    const comment_id = req.params.id;
    const data = req.body;

    const result = await Postcomments.createComment(data);
    res.status(200).json(result);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
}

// Update comment
async function updateComment(req, res) {
  try {
    const comment_id = req.params.id
    const data = req.body;
    const comment = await Postcomments.getCommentbyID(comment_id);
    const result = await comment.updateComment(data);
    res.status(200).json(result);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
}

// Delete comment
async function deleteComment(req, res) {
  try {
    const comment_id = req.params.id;
    const comment = await Postcomments.getCommentbyID(comment_id);
    const result = await comment.deleteComment();
    res.status(204).json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

module.exports = {
  getCommentsbyPostID,
  getCommentbyID,
  createComment,
  updateComment,
  deleteComment,
};
