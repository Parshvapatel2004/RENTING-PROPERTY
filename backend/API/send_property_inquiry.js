const { ObjectId } = require("mongodb");
const connectDB = require("../DB/connectDB");

async function send_property_inquiry(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("PropertyInquiry");
    const { propertyId, owner_Id, name, email, phone, inquiry } = req.body;

    if (!propertyId || !owner_Id || !name || !email || !phone || !inquiry) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await collection.insertOne({
      propertyId: ObjectId.createFromHexString(propertyId),
      owner_Id: ObjectId.createFromHexString(owner_Id),
      name,
      email,
      phone,
      inquiry,
      inquiryDate: new Date(),
      status: "Pending",
      resolutionDate: null,
      response: null,
    });
    return res.status(200).json({ message: "Inquiry sent Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
  }
}

module.exports = { send_property_inquiry };
