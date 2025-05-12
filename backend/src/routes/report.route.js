const express = require("express");
const router = express.Router();

const controller = require("../controllers/report.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Create a new report
router.post("/create", authMiddleware(), controller.createReport);

// Get all reports
router.get("/get", authMiddleware(), controller.getAllReports);

// Get report by ID
router.get("/get/:id", authMiddleware(), controller.getReportById);

// Get report by article ID
router.get(
  "/get-article/:articleId",
  authMiddleware(),
  controller.getReportByArticleId
);

// Get report by comment ID
router.get(
  "/get-comment/:commentId",
  authMiddleware(),
  controller.getReportByCommentId
);

// Edit a report
router.patch("/edit/:id", authMiddleware(), controller.editReport);

// Delete a report
router.delete("/delete/:id", authMiddleware(), controller.deleteReport);

// Delete multiple reports
router.delete(
  "/delete-multiple",
  authMiddleware(),
  controller.deleteMultipleReports
);

module.exports = router;
