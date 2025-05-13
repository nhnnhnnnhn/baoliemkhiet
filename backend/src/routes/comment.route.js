const express = require("express");
const commentController = require("../controllers/comment.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

// POST /api/comments
router.post("/", authMiddleware(), commentController.createComment);

// GET /api/comments/:article_id
router.get("/:article_id", commentController.getComments);

// PUT /api/comments/:comment_id
router.put("/:comment_id", authMiddleware(), commentController.updateComment);

// DELETE /api/comments/:comment_id
router.delete(
  "/:comment_id",
  authMiddleware(),
  commentController.deleteComment
);

module.exports = router;
