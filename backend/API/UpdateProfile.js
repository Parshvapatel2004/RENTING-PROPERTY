const connectDB = require("../DB/connectDB");
const { ObjectId } = require("mongodb");

async function UpdateProfile(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Register");

    const { firstName, lastName, email, phoneNo, password, bio } = req.body;
    const profilePic =
      req.files && req.files["profilePic"]
        ? req.files["profilePic"][0].filename
        : null;

    const owner = req.session.user;
    if (!owner) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const ownerId = owner.session._id;

    // Find the existing owner record
    const existingOwner = await collection.findOne({
      _id: ObjectId.createFromHexString(ownerId),
    });

    if (!existingOwner) {
      return res.status(404).json({ message: "Data not found" });
    }

    // Use the provided fields if available, otherwise use existing values
    const updatedData = {
      firstName: firstName || existingOwner.firstName,
      lastName: lastName || existingOwner.lastName,
      email: email || existingOwner.email,
      phoneNo: phoneNo || existingOwner.phoneNo,
      password: password || existingOwner.password,
      bio: bio || existingOwner.bio || "",
      profilePic: profilePic || existingOwner.profilePic || "",
    };

    // Update in database
    await collection.updateOne(
      { _id: ObjectId.createFromHexString(ownerId) },
      { $set: updatedData }
    );

    req.session.user = {
      session: { ...owner.session, ...updatedData },
      isAuth: true,
    };

    return res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { UpdateProfile };
