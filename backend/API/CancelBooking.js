const { ObjectId } = require("mongodb");
const connectDB = require("../DB/connectDB");

async function cancel_booking_request(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Request");

    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user_Id = user.session._id;
    const { requestId } = req.body; // Pass requestId in body

    if (!requestId) {
      return res.status(400).json({ message: "Request ID is required" });
    }

    // Check if request exists and belongs to this user
    const request = await collection.findOne({
      _id: ObjectId.createFromHexString(requestId),
      user_Id: ObjectId.createFromHexString(user_Id),
    });

    if (!request) {
      return res.status(404).json({ message: "Booking request not found" });
    }

    // Update the status to 'cancelled'
    await collection.updateOne(
      { _id: ObjectId.createFromHexString(requestId) },
      { $set: { status: "Canceled" } }
    );

    return res
      .status(200)
      .json({ message: "Booking request has been cancelled successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { cancel_booking_request };
