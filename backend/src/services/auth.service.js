const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient, Role } = require("@prisma/client");
const prisma = new PrismaClient();
const { sendOtp, verifyOtp } = require("./otp.service");

async function loginUser(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
  refreshToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30d",
    }
  );
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

async function registerUser(email, password, fullname, bio, avatar, role, otp) {
  await this.verifyOtp(email, otp, action);
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Email already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullname,
      role: role === "JOURNALIST" ? Role.JOURNALIST : Role.USER,
      bio: bio || "",
      avatar: avatar || "",
    },
  });
  return user;
}

async function logoutUser(userId) {
  await prisma.jwtToken.deleteMany({
    where: {
      userId,
    },
  });
}

async function changePassword(userId, oldPassword, newPassword, otp) {
  await this.verifyOtp(email, otp, action);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await this.jwtToken.deleteMany({
    where: {
      userId,
    },
  });
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return true;
}

module.exports = {
  loginUser,
  registerUser,
  logoutUser,
  changePassword,
};
