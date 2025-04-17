const { ObjectId } = require("mongodb");
const connectDB = require("../DB/connectDB");

async function view_payments(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Payment");

    const owner = req.session.user;
    if (!owner) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const owner_Id = owner.session._id;
    const paymentData = await collection
      .find({ owner_Id: ObjectId.createFromHexString(owner_Id) })
      .toArray();

    if (paymentData.length === 0) {
      res.status(404).json({ message: "No Payment Found" });
    } else {
      res
        .status(200)
        .json({ message: "Payment found Suceesfully", data: paymentData });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
  }
}

module.exports = { view_payments };
