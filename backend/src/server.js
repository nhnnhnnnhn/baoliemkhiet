require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const authRoute = require("./routes/auth.route");

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

app.use("/api/auth", authRoute);

app.listen(3000, () => console.log("Server running on port 3000"));
