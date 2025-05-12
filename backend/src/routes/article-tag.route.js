const express = require("express");
const router = express.Router();
const articleTagController = require("../controllers/article-tag.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Add tag to article
router.post(
  "/articles/:articleId/tags",
  authMiddleware(),
  articleTagController.addTagToArticle
);

// Remove tag from article
router.delete(
  "/articles/:articleId/tags/:tagId",
  authMiddleware(),
  articleTagController.removeTagFromArticle
);

// Get article tags
router.get(
  "/articles/:articleId/tags",
  authMiddleware(),
  articleTagController.getArticleTags
);

// Update article tags
router.put(
  "/articles/:articleId/tags",
  authMiddleware(),
  articleTagController.updateArticleTags
);

module.exports = router;
