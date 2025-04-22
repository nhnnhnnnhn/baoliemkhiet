const nodeMailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
  const otp = await prisma.otp.create({
    data: {
      email,
      code: otpGenerator().toString(),
      action,
    },
  });
  if (!otp) {
    throw new Error("Failed to generate OTP");
  }

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp.code}`,
  });
  return otp;
}

async function verifyOtp(email, code, action) {    
  const otp = await prisma.otp.findFirst({
    where: {
      email: email,
      code: code,
      action: action,
    } 
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
