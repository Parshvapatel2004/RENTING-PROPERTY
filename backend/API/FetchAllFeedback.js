const connectDB = require("../DB/connectDB");

async function FetchAllFeedback(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Feedback");
    const userData = await collection.find().toArray();
    if (userData == 0) {
      res.status(404).json({ message: "No Feedback Found" });
    } else {
      res
        .status(200)
        .json({ message: "Feedback found Suceesfully", data: userData });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
  }
}

module.exports = { FetchAllFeedback };
