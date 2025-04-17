const connectDB = require("../DB/connectDB");

async function changeUserPassword(req, res) {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required!",
      });
    }

    const db = await connectDB();
    const userCollection = db.collection("Register");

    // Find the user
    const user = await userCollection.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    // Update the password in the database (without hashing)
    await userCollection.updateOne(
      { _id: user._id },
      { $set: { password: newPassword } }
    );

    return res
      .status(200)
      .json({ success: true, message: "Password changed successfully!" });
  } catch (error) {
    console.error("Change Password API Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

module.exports = { changeUserPassword };
