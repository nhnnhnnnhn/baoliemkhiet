import axiosClient from "./axiosClient"

const notificationApi = {
  async getNotifications() {
    return await axiosClient.get("/notifications", {})
  },
  async markAsRead(notification_id: number) {
    return await axiosClient.put(`/notifications/read/${notification_id}`)
  },
  async markAllAsRead() {
    return await axiosClient.put(`/notifications/read-all`)
  },
  async getUnreadCount() {
    return await axiosClient.get(`/notifications/count-unread`, {})
  },
  async deleteNotification(notification_id: number) {
    return await axiosClient.delete(`/notifications/${notification_id}`)
  },
}

export default notificationApi
