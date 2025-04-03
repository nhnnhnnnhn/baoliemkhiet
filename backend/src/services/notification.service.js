const { PrismaClient, NotificationType } = require("@prisma/client");
const prisma = new PrismaClient();

async function createNotification(receiver_id, content, type) {
  const user = await prisma.user.findUnique({
    where: { id: receiver_id },
  });
  if (!user) {
    throw new Error("User not found");
  }

  if (!Object.values(NotificationType).includes(type)) {
    throw new Error("Invalid notification type");
  }

  const notification = await prisma.notification.create({
    data: {
      receiver_id,
      content,
      type,
    },
  });
  return notification;
}

async function getNotifications(receiver_id) {
  const user = await prisma.user.findUnique({
    where: { id: receiver_id },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const notifications = await prisma.notification.findMany({
    where: { receiver_id },
    orderBy: { created_at: "desc" },
  });
  return notifications;
}

async function markNotificationAsRead(notification_id) {
  const notification = await prisma.notification.findUnique({
    where: { id: notification_id },
  });
  if (!notification) {
    throw new Error("Notification not found");
  }

  const updatedNotification = await prisma.notification.update({
    where: { id: notification_id },
    data: { is_read: true },
  });
  return updatedNotification;
}

async function deleteNotification(notification_id) {
  const notification = await prisma.notification.findUnique({
    where: { id: notification_id },
  });
  if (!notification) {
    throw new Error("Notification not found");
  }

  const deletedNotification = await prisma.notification.delete({
    where: { id: notification_id },
  });
  return deletedNotification;
}

async function markAllNotificationsAsRead(receiver_id) {
  const user = await prisma.user.findUnique({
    where: { id: receiver_id },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const updatedNotifications = await prisma.notification.updateMany({
    where: { receiver_id },
    data: { is_read: true },
  });
  return updatedNotifications;
}

async function getUnreadNotificationCount(receiver_id) {
  const user = await prisma.user.findUnique({
    where: { id: receiver_id },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const count = await prisma.notification.count({
    where: { receiver_id, is_read: false },
  });
  return count;
}

module.exports = {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
};
