const { ObjectId } = require("mongodb");
const connectDB = require("../DB/connectDB");

async function send_request(req, res) {
  try {
    const db = await connectDB();
    const requestCollection = db.collection("Request");
    const { property_Id, owner_Id, startDate, endDate } = req.body;

    if (!property_Id || !owner_Id || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Convert dates to Date objects
    const requestedStartDate = new Date(startDate);
    const requestedEndDate = new Date(endDate);

    // Check if the property is already booked for these dates
    const existingBooking = await requestCollection.findOne({
      property_Id: ObjectId.createFromHexString(property_Id),
      status: { $in: ["Confirmed", "Pending", "Paid"] }, // Check both approved and pending requests
      $or: [
        {
          // Existing booking starts during the requested period
          startDate: { $lte: requestedEndDate },
          endDate: { $gte: requestedStartDate },
        },
        {
          // Existing booking ends during the requested period
          startDate: { $lte: requestedEndDate },
          endDate: { $gte: requestedStartDate },
        },
        {
          // Existing booking completely contains the requested period
          startDate: { $lte: requestedStartDate },
          endDate: { $gte: requestedEndDate },
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        message:
          "Property is already booked or has a pending request for the selected dates",
      });
    }

    const user_Id = user.session._id;
    await requestCollection.insertOne({
      user_Id: ObjectId.createFromHexString(user_Id),
      property_Id: ObjectId.createFromHexString(property_Id),
      owner_Id: ObjectId.createFromHexString(owner_Id),
      startDate: requestedStartDate,
      endDate: requestedEndDate,
      status: "Pending",
      bookingDate: new Date(),
    });

    return res.status(200).json({ message: "Request sent Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
  }
}

module.exports = { send_request };
