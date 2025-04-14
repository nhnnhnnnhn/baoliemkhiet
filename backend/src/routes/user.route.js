const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Create a new user (public access)
router.post("/", userController.createUser);

// Get all users (auth required)
router.get("/", authMiddleware, userController.getAllUsers);

// Get user by ID (auth required)
router.get("/:id", authMiddleware, userController.getUserById);

// Delete user (auth required)
router.delete("/:id", authMiddleware, userController.deleteUser);

// Update user (auth required)
router.put("/:id", authMiddleware, userController.updateUser);

module.exports = router;