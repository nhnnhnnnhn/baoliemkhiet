const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient, Role } = require("@prisma/client");
const prisma = new PrismaClient();

async function loginUser(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
  await prisma.jwtToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
    },
  });
  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

async function registerUser(email, password, fullname) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullname,
      role: Role.USER,
    },
  });
  return user;
}
module.exports = {
  loginUser,
  registerUser,
};
