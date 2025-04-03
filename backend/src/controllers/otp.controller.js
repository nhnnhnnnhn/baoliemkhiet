const otpService = require("../services/otp.service");
const controllerHandler = require("../utils/controllerHandler");

const sendOtp = controllerHandler(async (req, res) => {
  const { email, action } = req.body;
  const otp = await otpService.sendOtp(email, action);
  res.status(200).json({ message: "OTP sent successfully", otp });
});

const verifyOtp = controllerHandler(async (req, res) => {
  const { email, code, action } = req.body;
  await otpService.verifyOtp(email, code, action);
  res.status(200).json({ message: "OTP verified successfully" });
});

module.exports = {
  sendOtp,
  verifyOtp,
};
