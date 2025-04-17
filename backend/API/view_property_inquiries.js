const connectDB = require("../DB/connectDB");
const { ObjectId } = require("mongodb");

async function get_property_inquiries(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("PropertyInquiry");

    const { propertyId } = req.body;
    const owner = req.session.user; // Get owner session data

    if (!owner) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!propertyId) {
      return res.status(400).json({ message: "Property ID is required" });
    }

    const owner_Id = owner.session._id;

    // Find inquiries where owner_Id matches and propertyId matches
    const inquiries = await collection
      .find({
        propertyId: ObjectId.createFromHexString(propertyId),
        owner_Id: ObjectId.createFromHexString(owner_Id),
      })
      .sort({ inquiryDate: -1 }) // Sort inquiries by newest first
      .toArray();

    return res.status(200).json({ data: inquiries });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { get_property_inquiries };
