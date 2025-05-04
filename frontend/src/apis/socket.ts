// src/apis/socket.ts
import { Manager } from "socket.io-client";

interface Socket {
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback?: (...args: any[]) => void) => void;
  emit: (event: string, data?: any) => void;
  disconnect: () => void;
}

interface NotificationPayload {
  receiver_id: number;
  content: string;
  type: "MESSAGE" | "COMMENT" | "LIKE" | "FOLLOW" | "ARTICLE_STATUS";
  article_id?: number;
}

let socket: Socket | null = null;

export const initializeSocket = (jwt_token: string): Socket => {
  if (!socket) {
    const manager = new Manager(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    );
    const newSocket = manager.socket("/") as Socket;

    newSocket.on("connect", () => {
      console.log("Socket connected");
      // Send login event with JWT token
      newSocket.emit("login", { jwt_token });
    });

    newSocket.on("error", (error: Error) => {
      console.error("Socket error:", error);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket = newSocket;
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
