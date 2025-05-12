const express = require("express");
const fileController = require("../controllers/file.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const fileService = require("../services/file.service");
const router = express.Router();

// POST /api/files/upload
router.post(
  "/upload",
  authMiddleware(),
  fileService.upload.single("file"),
  fileController.uploadFile
);

module.exports = router;
