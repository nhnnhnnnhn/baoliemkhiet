const express = require("express");
const router = express.Router();

const controller = require("../controllers/article.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// === API công khai (public) - Không yêu cầu xác thực ===

// === API công khai (public) - Không yêu cầu xác thực ===

// Get all articles (public)
router.get("/get", controller.getAllArticles);

// Get all posted articles (public)
router.get("/get-posted", controller.getAllPostedArticles);

// Get a single article by ID (public)
router.get("/get/:id", controller.getArticleById);

// Get most 5 viewed articles (public)
router.get("/most-viewed", controller.getMostViewedArticles);

// Get articles by categorys (public)
router.get("/get-category/:categoryId", controller.getArticlesByCategory);

// Get articles by author (public)
router.get("/get-author/:authorId", controller.getArticlesByAuthor);

// Get articles by author (public)
router.get(
  "/get-post-author/:authorId",
  authMiddleware(),
  controller.getPostArticlesByAuthor
);


// Get articles statistics (public)
router.get("/statistics/:id", authMiddleware(), controller.getArticlesStatistics);

// Get most 5 liked articles (public)
router.get("/most-liked", controller.getMostLikedArticles);

// Get articles by status - chỉ cho phép xem bài đã PUBLISHED
router.get("/get-status/:status", (req, res, next) => {
  if (req.params.status === "PUBLISHED") {
    return controller.getArticlesByStatus(req, res, next);
  }
  // Chỉ admin/editor mới được xem các bài chưa publish
  return authMiddleware(["ADMIN", "EDITOR"])(req, res, () =>
    controller.getArticlesByStatus(req, res, next)
  );
});

// Get articles by tag (public)
router.get("/get-tag/:tagId", controller.getArticlesByTag);

// Get articles by date range (public)
router.get("/get-date-range", controller.getArticlesByDateRange);

// Get related articles (public)
router.get("/related/:id", controller.getRelatedArticles);

// Search articles (public)
router.get("/search", controller.searchArticles);

// === API được bảo vệ - Yêu cầu xác thực ===

// Create a new article (protected)
router.post("/create/", authMiddleware(), controller.createArticle);

// Get Statistics (protected)
router.get("/statistics", authMiddleware(), controller.getStatistics);

// Edit an article
router.patch("/edit/:id", authMiddleware(), controller.editArticle);

// Approve an article
router.patch("/approve/:id", authMiddleware(), controller.approveArticle);

// Reject an article
router.patch("/reject/:id", authMiddleware(), controller.rejectArticle);

// Delete an article
router.delete("/delete/:id", authMiddleware(), controller.deleteArticle);

// Delete multiple articles
router.delete(
  "/delete-multiple",
  authMiddleware(),
  controller.deleteMultipleArticles
);


module.exports = router;
