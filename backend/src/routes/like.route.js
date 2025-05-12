const express = require("express");
const likeController = require("../controllers/like.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

// POST /api/likes/:article_id
router.post("/:article_id", authMiddleware(), likeController.createLike);

// DELETE /api/likes/:article_id
router.delete("/:article_id", authMiddleware(), likeController.deleteLike);

// GET /api/likes/:article_id
router.get(
  "/:article_id",
  authMiddleware(),
  likeController.getLikesByArticleId
);

module.exports = router;
