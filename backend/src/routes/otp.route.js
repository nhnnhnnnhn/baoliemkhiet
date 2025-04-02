const express = require("express");
const otpController = require("../controllers/otp.controller");
const router = express.Router();

// POST /api/otp/send
router.post("/send", otpController.sendOtp);

// POST /api/otp/verify
router.post("/verify", otpController.verifyOtp);

module.exports = router;
