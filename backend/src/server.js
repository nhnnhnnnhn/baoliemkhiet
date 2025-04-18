require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const http = require("http");
const morgan = require("./configs/morgan.config");
const { initWebSocket } = require("./websocket");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("./swagger-output.json");

const authRoute = require("./routes/auth.route");
const otpRoute = require("./routes/otp.route");
const notificationRoute = require("./routes/notification.route");
const commentRoute = require("./routes/comment.route");
const fileRoute = require("./routes/file.route");
const articleRoute = require("./routes/article.route");
const categoryRoute = require("./routes/category.route");
const reportRoute = require("./routes/report.route");
const followRoute = require("./routes/follow.route");
const tagRoute = require("./routes/tag.route");
const articleTagRoute = require("./routes/article-tag.route");
const userRoute = require("./routes/user.route");
const configurationRoute = require("./routes/configuration.route");

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
const server = http.createServer(app);

// Initialize WebSocket
const wss = initWebSocket(server);

// Swagger configuration
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use("/api/auth", authRoute);
app.use("/api/otp", otpRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/comments", commentRoute);
app.use("/api/file", fileRoute);
app.use("/api/articles", articleRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/reports", reportRoute);
app.use("/api/follows", followRoute);
app.use("/api/tags", tagRoute);
app.use("/api", articleTagRoute);
app.use("/api/users", userRoute);
app.use("/api/configuration", configurationRoute);

// Export wss for use in other files
app.set("wss", wss);

server.listen(3000, () => console.log("Server running on port 3000"));
