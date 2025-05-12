const express = require("express");
const notificationController = require("../controllers/notification.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

// POST /api/notifications
router.post("/", authMiddleware(), notificationController.createNotification);

// GET /api/notifications/:receiver_id
router.get("/", authMiddleware(), notificationController.getNotifications);

// PUT /api/notifications/:notification_id/read
router.put(
  "/read/:notification_id",
  authMiddleware(),
  notificationController.markNotificationAsRead
);

// DELETE /api/notifications/:notification_id
router.delete(
  "/:notification_id",
  authMiddleware(),
  notificationController.deleteNotification
);

// PUT /api/notifications/:receiver_id/read-all
router.put(
  "/read-all/",
  authMiddleware(),
  notificationController.markAllNotificationsAsRead
);

// GET /api/notifications/count/:receiver_id
router.get(
  "/count-unread/",
  authMiddleware(),
  notificationController.getNotificationCount
);

module.exports = router;
