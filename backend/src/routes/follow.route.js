const express = require("express");
const router = express.Router();
const followController = require("../controllers/follow.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Create a new follow
router.post("/", authMiddleware(), followController.createFollow);

// Delete a follow
router.delete(
  "/:journalistId",
  authMiddleware(),
  followController.deleteFollow
);

// Delete a follower (by journalist)
router.delete(
  "/by-journalist/:followerId",
  authMiddleware(),
  followController.deleteFollowerByJournalist
);

// Get list of followers
router.get("/followers/:userId", authMiddleware(), followController.getFollowers);

// Get list of following
router.get("/following/:userId", authMiddleware(), followController.getFollowing);

// Check if following a journalist
router.get(
  "/:journalistId/check",
  authMiddleware(),
  followController.checkFollowing
);

module.exports = router;
