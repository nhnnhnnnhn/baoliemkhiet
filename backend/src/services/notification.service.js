const { PrismaClient, NotificationType } = require("@prisma/client");
const prisma = new PrismaClient();

async function createNotification(receiver_id, content, type) {
  console.log(`[NOTIFICATION SERVICE] Creating notification for user ${receiver_id}:`, { content, type });
  
  const user = await prisma.user.findUnique({
    where: { id: receiver_id },
  });
  if (!user) {
    console.error(`[NOTIFICATION SERVICE] User ${receiver_id} not found`);
    throw new Error("User not found");
  }

  if (!Object.values(NotificationType).includes(type)) {
    console.error(`[NOTIFICATION SERVICE] Invalid notification type: ${type}`);
    throw new Error("Invalid notification type");
  }

  try {
    const notification = await prisma.notification.create({
      data: {
        receiver_id,
        content,
        type,
      },
    });
    console.log(`[NOTIFICATION SERVICE] Notification created with ID: ${notification.id}`);
    return notification;
  } catch (error) {
    console.error(`[NOTIFICATION SERVICE] Error creating notification:`, error);
    throw error;
  }
}

async function getNotifications(receiver_id) {
  console.log(`[NOTIFICATION SERVICE] Getting notifications for user: ${receiver_id}`);
  
  const user = await prisma.user.findUnique({
    where: { id: receiver_id },
  });
  console.log("[NOTIFICATION SERVICE] receiver_id", receiver_id);

  if (!user) {
    console.error(`[NOTIFICATION SERVICE] User ${receiver_id} not found`);
    throw new Error("User not found");
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { receiver_id },
      orderBy: { created_at: "desc" },
    });
    console.log(`[NOTIFICATION SERVICE] Found ${notifications.length} notifications for user ${receiver_id}`);
    return {
      data: notifications,
    };
  } catch (error) {
    console.error(`[NOTIFICATION SERVICE] Error getting notifications:`, error);
    throw error;
  }
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
  console.log(`[NOTIFICATION SERVICE] Getting unread count for user: ${receiver_id}`);
  
  const user = await prisma.user.findUnique({
    where: { id: receiver_id },
  });
  if (!user) {
    console.error(`[NOTIFICATION SERVICE] User ${receiver_id} not found`);
    throw new Error("User not found");
  }

  try {
    const count = await prisma.notification.count({
      where: { receiver_id, is_read: false },
    });
    console.log(`[NOTIFICATION SERVICE] Unread count for user ${receiver_id}: ${count}`);
    return {
      data: count,
    };
  } catch (error) {
    console.error(`[NOTIFICATION SERVICE] Error getting unread count:`, error);
    throw error;
  }
}

module.exports = {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
};
