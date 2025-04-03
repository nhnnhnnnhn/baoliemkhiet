const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { PrismaClient, NotificationType } = require("@prisma/client");
const prisma = new PrismaClient();

const notificationService = require("./services/notification.service");

// Store connected clients
const connectedClients = new Map();
const onlineUser = new Map();

function initWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins (adjust as needed)
    },
  });

  io.on("connection", (socket) => {
    try {
      const clientId = socket.id;
      connectedClients.set(clientId, socket);
      console.log(`Client connected: ${clientId}`);

      // Handle user login and store in onlineUser map
      socket.on("login", (payload) => {
        const { jwt_token } = payload;
        let user_id = null;
        try {
          const decoded = jwt.verify(
            jwt_token,
            process.env.ACCESS_TOKEN_SECRET
          ); // Verify JWT token
          user_id = decoded.id; // Extract user_id from the decoded token
        } catch (err) {
          console.error("Token verification error:", err);
          socket.emit("error", { message: "Invalid token" });
        }
        // Check if user_id is valid
        if (user_id && !onlineUser.has(user_id)) {
          // Check if user is already online
          onlineUser.set(user_id, clientId); // Store user_id and clientId in onlineUser map
          console.log(`User ${user_id} logged in`);
          io.emit("updateOnlineUsers", Array.from(onlineUser.keys()));
        } else {
          socket.emit("error", { message: "User already logged in" });
        }
      });

      // Handle user logout
      socket.on("logout", (payload) => {
        const { jwt_token } = payload;
        let user_id = null;
        try {
          const decoded = jwt.verify(
            jwt_token,
            process.env.ACCESS_TOKEN_SECRET
          ); // Verify JWT token
          user_id = decoded.id; // Extract user_id from the decoded token
        } catch (err) {
          console.error("Token verification error:", err);
          socket.emit("error", { message: "Invalid token" });
          return;
        }

        if (user_id && onlineUser.has(user_id)) {
          onlineUser.delete(user_id); // Remove user from onlineUser map
          console.log(`User ${user_id} logged out`);
          io.emit("updateOnlineUsers", Array.from(onlineUser.keys())); // Update all clients
        } else {
          socket.emit("error", { message: "User not logged in" });
        }
      });

      // Handle client disconnect
      socket.on("disconnect", () => {
        connectedClients.delete(clientId);

        // Remove user from onlineUser map
        for (const [user_id, id] of onlineUser.entries()) {
          if (id === clientId) {
            onlineUser.delete(user_id);
            console.log(`User ${user_id} went offline`);
            break;
          }
        }

        io.emit("updateOnlineUsers", Array.from(onlineUser.keys())); // Update all clients
        console.log(`Client disconnected: ${clientId}`);
      });

      //handle notification
      socket.on("notification", (payload) => {
        const { receiver_id, content, type, article_id } = payload;
        if (onlineUser.has(user_id)) {
          const clientId = onlineUser.get(user_id);
          const clientSocket = connectedClients.get(clientId);
          if (clientSocket) {
            clientSocket.emit("notification", notification); // Send notification to the specific user
          }
        }
      });

      // Handle incoming messages
      socket.on("message", (data) => {
        console.log(`Received from ${clientId}:`, data);
        socket.emit("response", { message: "Message received", data });
      });
    } catch (err) {
      console.error("Connection error:", err);
    }
  });

  return io;
}

async function sendNotification(receiver_id, content, type, article_id) {
  // First, ensure the receiver is online
  if (onlineUser.has(receiver_id)) {
    const clientId = onlineUser.get(receiver_id);
    const clientSocket = connectedClients.get(clientId);

    await prisma.notification.create({
      data: {
        receiver_id,
        content,
        type,
        article_id,
      },
    });

    if (clientSocket) {
      // Send the notification via WebSocket
      const notification = {
        content,
        type,
        article_id,
      };

      // Emit the notification to the specific client
      clientSocket.emit("notification", notification);
    }
  } else {
    console.log(`User ${receiver_id} is not online`);
  }
}

module.exports = { initWebSocket, sendNotification };
