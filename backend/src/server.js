require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const http = require("http");
const morgan = require("./configs/morgan.config");
const { initWebSocket } = require("./websocket");

const authRoute = require("./routes/auth.route");
const otpRoute = require("./routes/otp.route");
const notificationRoute = require("./routes/notification.route");

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
const server = http.createServer(app);

// Initialize WebSocket
const wss = initWebSocket(server);

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use("/api/auth", authRoute);
app.use("/api/otp", otpRoute);
app.use("/api/notifications", notificationRoute);

// Export wss for use in other files
app.set("wss", wss);

server.listen(3000, () => console.log("Server running on port 3000"));
