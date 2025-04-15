const express = require("express");
const configurationController = require("../controllers/configuration.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

// POST /api/configuration
router.post("/", authMiddleware, configurationController.createConfiguration);

// GET /api/configuration
router.get("/", authMiddleware, configurationController.getConfiguration);

// PUT /api/configuration/:id
router.put("/:id", authMiddleware, configurationController.updateConfiguration);

module.exports = router;
