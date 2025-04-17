const connectDB = require("../DB/connectDB");

async function ContactUs(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Contact");
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    collection.insertOne({
      name,
      email,
      phone,
      subject,
      message,
      status:'Pending',
    });
    return res.status(200).json({ message: "Form sent Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Inter server error" });
  }
}
module.exports = { ContactUs };
