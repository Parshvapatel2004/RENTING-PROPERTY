const connectDB = require("../DB/connectDB");

async function send_feedback(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Feedback");
    const { name, email, rating, feedback } = req.body;

    if (!name || !email || !rating || !feedback) {
      return res.status(400).json({ message: "All fields are required" });
    }
    await collection.insertOne({
      name,
      email,
      rating: parseFloat(rating),
      feedback,
      response: null,
      status: "Pending",
      feedbackDate: new Date(),
    });
    return res.status(200).json({ message: "Feedack sent Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
  }
}

module.exports = { send_feedback };
