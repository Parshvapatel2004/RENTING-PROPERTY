const connectDB = require("../DB/connectDB");

async function FetchAllUser(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Register");
    const userData = await collection
      .find({
        role: "user",
      })
      .toArray();
    if (userData == 0) {
      res.status(404).json({ message: "No user Found" });
    } else {
      res
        .status(200)
        .json({ message: "User found Suceesfully", data: userData });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
  }
}

module.exports = { FetchAllUser };
