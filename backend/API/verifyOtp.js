const connectDB = require("../DB/connectDB");

async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required!" });
    }

    const db = await connectDB();
    const otpCollection = db.collection("otp");

    const otpEntry = await otpCollection.findOne({ email: email, otp: otp });

    if (!otpEntry) {
      return res.status(400).json({ success: false, message: "Invalid OTP!" });
    }

    if (new Date() > new Date(otpEntry.expiresAt)) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired!" });
    }

    await otpCollection.deleteOne({ _id: otpEntry._id });

    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully!" });
  } catch (error) {
    console.error("Verify OTP API Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

module.exports = { verifyOTP };
