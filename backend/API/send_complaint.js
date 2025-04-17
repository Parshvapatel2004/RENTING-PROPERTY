const connectDB = require("../DB/connectDB");

async function send_complaint(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Complaint");
    const { name, email, complaint } = req.body;

    if (!name || !email || !complaint) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await collection.insertOne({
      name,
      email,
      complaint,
      status: "Pending",
      response: null,
    });

    return res.status(200).json({ message: "Complaint sent Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
  }
}

module.exports = { send_complaint };
