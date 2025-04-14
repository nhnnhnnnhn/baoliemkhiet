const express = require('express');
const router = express.Router();

const controller = require('../controllers/article.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Create a new article
router.post('/create/', authMiddleware, controller.createArticle);

// Get all articles
router.get('/get', authMiddleware, controller.getAllArticles);

// Get all posted articles
router.get('/get-posted', authMiddleware, controller.getAllPostedArticles);

// Get a single article by ID
router.get('/get/:id', authMiddleware, controller.getArticleById);

// Get most 5 viewed articles
router.get('/most-viewed', authMiddleware, controller.getMostViewedArticles);

// Get articles by categorys
router.get('/get-category/:categoryId', authMiddleware, controller.getArticlesByCategory);

// Get articles by author
router.get('/get-author/:authorId', authMiddleware, controller.getArticlesByAuthor);

// Get most 5 liked articles
router.get('/most-liked', authMiddleware, controller.getMostLikedArticles);

// Get articles by status
router.get('/get-status/:status', authMiddleware, controller.getArticlesByStatus);

// Get articles by tag
router.get('/get-tag/:tagId', authMiddleware, controller.getArticlesByTag);

// Get articles by date range
router.get('/get-date-range', authMiddleware, controller.getArticlesByDateRange);

// Get related articles
router.get('/related/:id', authMiddleware, controller.getRelatedArticles);

// Get Statistics
router.get('/statistics', authMiddleware, controller.getStatistics);

// Search articles
router.get('/search', authMiddleware, controller.searchArticles);

// Edit an article
router.patch('/edit/:id', authMiddleware, controller.editArticle);

// Approve an article
router.patch('/approve/:id', authMiddleware, controller.approveArticle);

// Reject an article
router.patch('/reject/:id', authMiddleware, controller.rejectArticle);

// Delete an article
router.delete('/delete/:id', authMiddleware, controller.deleteArticle);

// Delete multiple articles
router.delete('/delete-multiple', authMiddleware, controller.deleteMultipleArticles);

module.exports = router;