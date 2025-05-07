const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

// GET /api/dashboard/statistic
router.get(
  "/statistic",
  authMiddleware,
  dashboardController.getStatisticByUserId
);

// GET /api/dashboard/view-week
router.get(
  "/view-week",
  authMiddleware,
  dashboardController.getViewByWeekInMonth
);

// GET /api/dashboard/most-viewed-articles
router.get(
  "/most-viewed-articles",
  authMiddleware,
  dashboardController.getMostViewedArticles
);

module.exports = router;
