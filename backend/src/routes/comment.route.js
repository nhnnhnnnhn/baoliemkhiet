const express = require("express");
const commentController = require("../controllers/comment.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();
const roleMiddleware = require("../middlewares/role.middleware");
const { Role } = require("@prisma/client");

// POST /api/comments
router.post("/", authMiddleware, commentController.createComment);

// GET /api/comments/:article_id
router.get(
  "/:article_id",
  authMiddleware,
  roleMiddleware([Role.ADMIN, Role.USER]),
  commentController.getComments
);

// PUT /api/comments/:comment_id
router.put("/:comment_id", authMiddleware, commentController.updateComment);

// DELETE /api/comments/:comment_id
router.delete("/:comment_id", authMiddleware, commentController.deleteComment);

module.exports = router;
