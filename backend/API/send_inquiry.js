const connectDB = require("../DB/connectDB");

async function send_inquiry(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Inquiry");
    const {
      inquiry_Id,
      user_Id,
      owner_Id,
      inquiryDate,
      subject,
      resolutionDate,
      response,
    } = req.body;
    await collection.insertOne({
      inquiry_Id,
      user_Id,
      owner_Id,
      inquiryDate,
      subject,
      status: "Pending",
      resolutionDate,
      response,
    });
    return res.status(200).json({ message: "Inquiry sent Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
  }
}

module.exports = { send_inquiry };
