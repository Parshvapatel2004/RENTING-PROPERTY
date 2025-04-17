const connectDB = require("../DB/connectDB");
const { ObjectId } = require("mongodb");

async function update_request_status(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Request");

    const { requestId, status } = req.body;
    const owner = req.session.user; // Get owner session data

    if (!owner) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!requestId || !status) {
      return res
        .status(400)
        .json({ message: "Request ID and status are required" });
    }

    const owner_Id = owner.session._id;

    // Find the request to ensure it belongs to the owner
    const request = await collection.findOne({
      _id: ObjectId.createFromHexString(requestId),
      owner_Id: ObjectId.createFromHexString(owner_Id),
    });

    if (!request) {
      return res
        .status(404)
        .json({ message: "Request not found or unauthorized" });
    }

    // Update the request status
    await collection.updateOne(
      { _id: ObjectId.createFromHexString(requestId) },
      { $set: { status: status } }
    );

    return res
      .status(200)
      .json({ message: `Request status updated to ${status}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { update_request_status };
