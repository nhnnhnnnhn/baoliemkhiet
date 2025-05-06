import { io, Socket } from "socket.io-client";

interface NotificationPayload {
  receiver_id: number;
  content: string;
  type: "MESSAGE" | "COMMENT" | "LIKE" | "FOLLOW" | "ARTICLE_STATUS";
  article_id?: number;
}

let socket: Socket | null = null;

export const initializeSocket = (jwt_token: string): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000", {
      autoConnect: true,
      auth: {
        token: jwt_token
      },
      transports: ['websocket', 'polling']
    });

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
