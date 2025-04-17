const { ObjectId } = require("mongodb");
const connectDB = require("../DB/connectDB");

async function view_payments_user(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Payment");

    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user_Id = user.session._id;
    const paymentData = await collection
      .find({ user_Id: ObjectId.createFromHexString(user_Id) })
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

module.exports = { view_payments_user };
