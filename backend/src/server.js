require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const morgan = require("morgan");
const {
  loggerMiddleware,
  errorHandler,
} = require("./middlewares/logger.middleware");

const authRoute = require("./routes/auth.route");
const otpRoute = require("./routes/otp.route");

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

app.use(morgan("dev"));

app.use("/api/auth", authRoute);
app.use("/api/otp", otpRoute);

app.listen(3000, () => console.log("Server running on port 3000"));
