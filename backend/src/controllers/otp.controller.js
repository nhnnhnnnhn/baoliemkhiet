const otpService = require("../services/otp.service");

async function sendOtp(req, res) {
  const { email, action } = req.body;
  try {
    const otp = await otpService.sendOtp(email, action);
    res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function verifyOtp(req, res) {
  const { email, code, action } = req.body;
  try {
    await otpService.verifyOtp(email, code, action);
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  sendOtp,
  verifyOtp,
};
