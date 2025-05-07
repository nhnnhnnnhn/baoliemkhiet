import axiosClient from "./axiosClient";

const notificationApi = {
  async getNotifications() {
    const a = await axiosClient.get("/notifications", {});
    console.log(a);
    return a;
  },
  async markAsRead(notification_id: number) {
    return await axiosClient.put(`/notifications/read/${notification_id}`);
  },
  async markAllAsRead() {
    console.log("cc");

    return await axiosClient.put(`/notifications/read-all`);
  },
  async getUnreadCount() {
    return await axiosClient.get(`/notifications/count-unread`, {});
  },
  async deleteNotification(notification_id: number) {
    return await axiosClient.delete(`/notifications/${notification_id}`);
  },
};

export default notificationApi;