const connectDB = require("../DB/connectDB");

async function FetchAllOwner(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Register");
    const userData = await collection.find({ role: "owner" }).toArray();
    if (userData == 0) {
      res.status(404).json({ message: "No Owner Found" });
    } else {
      res
        .status(200)
        .json({ message: "Owner found Suceesfully", data: userData });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
  }
}

module.exports = { FetchAllOwner };
