const { ObjectId } = require("mongodb");
const connectDB = require("../DB/connectDB");

async function manage_bookings(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Booking"); 

    const owner = req.session.user;
    if (!owner) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const owner_Id = owner.session._id;

    const bookings = await collection
      .find({ owner_Id: ObjectId.createFromHexString(owner_Id) })
      .toArray();

    if (bookings.length === 0) {
      res.status(404).json({ message: "No Booking Found" });
    } else {
      res
        .status(200)
        .json({ message: "Booking found Suceesfully", data: bookings });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
  }
}

module.exports = { manage_bookings };
