const connectDB = require("../DB/connectDB");
const { ObjectId } = require("mongodb");

async function UpdateAdminProfilePic(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Admin");

    const profilePic =
      req.files && req.files["profilePic"]
        ? req.files["profilePic"][0].filename
        : null;

    if (!profilePic) {
      return res.status(400).json({ message: "No profile picture provided" });
    }

    const admin = req.session.user;
    if (!admin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const adminId = admin.session._id;

    const existingAdmin = await collection.findOne({
      _id: ObjectId.createFromHexString(adminId),
    });

    if (!existingAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    await collection.updateOne(
      { _id: ObjectId.createFromHexString(adminId) },
      { $set: { profilePic } }
    );

    // Update session
    req.session.user = {
      session: { ...admin.session, profilePic },
      isAuth: true,
    };

    return res
      .status(200)
      .json({ message: "Profile picture updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { UpdateAdminProfilePic };
