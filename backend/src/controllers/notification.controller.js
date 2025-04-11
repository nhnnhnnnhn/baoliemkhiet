const notificationService = require("../services/notification.service");
const controllerHandler = require("../utils/controllerHandler");

const createNotification = controllerHandler(async (req, res) => {
  const { receiver_id, content, type } = req.body;
  const notification = await notificationService.createNotification(
    receiver_id,
    content,
    type
  );
  res.status(201).json(notification);
});

const getNotifications = controllerHandler(async (req, res) => {
  const receiver_id = req.user.id;
  const notifications = await notificationService.getNotifications(receiver_id);
  res.status(200).json(notifications);
});

const markNotificationAsRead = controllerHandler(async (req, res) => {
  const notification_id = Number(req.params.notification_id);
  const notification = await notificationService.markNotificationAsRead(
    notification_id
  );
  res.status(200).json(notification);
});
const deleteNotification = controllerHandler(async (req, res) => {
  const notification_id = Number(req.params.notification_id);
  await notificationService.deleteNotification(notification_id);
  res.status(204).send();
});

const markAllNotificationsAsRead = controllerHandler(async (req, res) => {
  const receiver_id = req.user.id;
  if (isNaN(receiver_id)) {
    throw new Error("Invalid receiver_id");
  }
  await notificationService.markAllNotificationsAsRead(receiver_id);
  res.status(204).send();
});

const getNotificationCount = controllerHandler(async (req, res) => {
  const receiver_id = req.user.id;
  if (isNaN(receiver_id)) {
    throw new Error("Invalid receiver_id");
  }
  const count = await notificationService.getUnreadNotificationCount(
    receiver_id
  );
  res.status(200).json({ count });
});
module.exports = {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  markAllNotificationsAsRead,
  getNotificationCount,
};
