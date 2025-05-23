const express = require("express");
const router = express.Router();

const controller = require("../controllers/category.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Create a new category
router.post("/create", authMiddleware(), controller.createCategory);

// Get all categories (public)
router.get("/get", controller.getAllCategories);

// Get a single category by ID (public)
router.get("/get/:id", controller.getCategoryById);

// Edit a category
router.patch("/edit/:id", authMiddleware(), controller.editCategory);

// Delete a category
router.delete("/delete/:id", authMiddleware(), controller.deleteCategory);

// Delete multiple categories
router.delete(
  "/delete-multiple",
  authMiddleware(),
  controller.deleteMultipleCategories
);

// Get articles count by category
router.get(
  "/articles-count",
  authMiddleware(),
  controller.getArticlesCountByCategory
);

module.exports = router;
