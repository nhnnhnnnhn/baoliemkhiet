const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tag.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Create a new tag - needs auth and admin role
router.post("/", authMiddleware(), tagController.createTag);

// Delete a tag - needs auth and admin role
router.delete("/:id", authMiddleware(), tagController.deleteTag);

// Get all tags - public access
router.get("/", authMiddleware(), tagController.getAllTags);

// Get tag details - public access
router.get("/:id", authMiddleware(), tagController.getTagDetails);

// Get tags of an article - public access
router.get(
  "/article/:articleId",
  authMiddleware(),
  tagController.getArticleTags
);

module.exports = router;
