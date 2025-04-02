const nodeMailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");

const transporter = nodeMailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

otpGenerator = () => ~~(Math.random() * (999999 - 100000)) + 100000;

async function sendOtp(email, action) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (user && action === "REGISTER") {
    throw new Error("Email already exists");
  }
  const otp = await this.prisma.otp.create({
    data: {
      email,
      code: this.otpGenerator(),
      action,
    },
  });
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp.code}`,
  });
  return otp;
}

async function verifyOtp(email, code, action) {
  const otp = await this.prisma.otp.findFirst({
    where: {
      email,
      code,
      action,
    },
  });
  if (!otp) {
    throw new Error("Invalid OTP");
  }
  return true;
}

module.exports = {
  sendOtp,
  verifyOtp,
};
