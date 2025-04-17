const { ObjectId } = require("mongodb");
const connectDB = require("../DB/connectDB");

async function delete_property(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Property");

    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const owner_Id = user.session._id;
    const { property_Id } = req.body; // Property ID to delete

    if (!property_Id) {
      return res.status(400).json({ message: "Property ID is required" });
    }

    // Check if the property exists and belongs to the owner
    const existingProperty = await collection.findOne({
      _id: ObjectId.createFromHexString(property_Id),
      owner_Id: ObjectId.createFromHexString(owner_Id),
    });

    if (!existingProperty) {
      return res
        .status(404)
        .json({ message: "Property not found or unauthorized" });
    }

    // Update property status to "deleted"
    await collection.updateOne(
      { _id: ObjectId.createFromHexString(property_Id) },
      { $set: { status: "deleted" } }
    );

    return res
      .status(200)
      .json({ message: "Property marked as deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { delete_property };
