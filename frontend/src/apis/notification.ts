import axiosClient from "./axiosClient";

export interface Notification {
  id: number;
  type: "MESSAGE" | "COMMENT" | "LIKE" | "FOLLOW" | "ARTICLE_STATUS";
  content: string;
  receiver_id: number;
  is_read: boolean;
  created_at: string;
  article_id?: number;
}

export interface GetNotificationsResponse {
  data: Notification[];
}

export interface GetNotificationCountResponse {
  count: {
    data: number;
  };
}

const notificationApi = {
  async getNotifications() {
    console.log('[API] Fetching notifications');
    try {
      const response = await axiosClient.get<GetNotificationsResponse>("/notifications", {});
      console.log('[API] Notifications fetched:', response);
      return response;
    } catch (error) {
      console.error('[API] Error fetching notifications:', error);
      throw error;
    }
  },
  
  async markAsRead(notification_id: number) {
    console.log(`[API] Marking notification ${notification_id} as read`);
    return await axiosClient.put(`/notifications/read/${notification_id}`);
  },
  
  async markAllAsRead() {
    console.log('[API] Marking all notifications as read');
    return await axiosClient.put(`/notifications/read-all`);
  },
  
  async getUnreadCount() {
    console.log('[API] Getting unread count');
    try {
      const response = await axiosClient.get<GetNotificationCountResponse>(`/notifications/count-unread`, {});
      console.log('[API] Unread count:', response);
      return response;
    } catch (error) {
      console.error('[API] Error getting unread count:', error);
      throw error;
    }
  },
  
  async deleteNotification(notification_id: number) {
    console.log(`[API] Deleting notification ${notification_id}`);
    return await axiosClient.delete(`/notifications/${notification_id}`);
  },
};

export default notificationApi;