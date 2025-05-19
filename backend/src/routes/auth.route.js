const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

// POST /api/auth/login
router.post("/login", authController.login);
// POST /api/auth/register
router.post("/register", authController.register);

// POST /api/auth/change-password
router.post("/change-password", authController.changePassword);

// POST /api/auth/forgot-password
router.post("/forgot-password", authController.forgotPassword);

// PUT /api/auth/profile
router.put("/profile", authMiddleware(), authController.updateProfile);

// GET /api/auth/profile
router.get("/profile", authMiddleware(), authController.getProfile);

module.exports = router;
