const express = require('express');
const router = express.Router();

const controller = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Create a new category
router.post('/create', controller.createCategory);

// Get all categories
router.get('/get', controller.getAllCategories);

// Get a single category by ID
router.get('/get/:id', controller.getCategoryById);

// Edit a category
router.patch('/edit/:id', controller.editCategory);

// Delete a category
router.delete('/delete/:id', controller.deleteCategory);

// Delete multiple categories
router.delete('/delete-multiple', controller.deleteMultipleCategories);

// Get articles count by category
router.get('/articles-count', controller.getArticlesCountByCategory);

module.exports = router;