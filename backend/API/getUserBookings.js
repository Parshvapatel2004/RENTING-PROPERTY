const { ObjectId } = require("mongodb");
const connectDB = require("../DB/connectDB");

async function get_user_booking(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Request");

    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user_Id = user.session._id;

    const requests = await collection
      .aggregate([
        {
          $match: { user_Id: ObjectId.createFromHexString(user_Id) },
        },
        {
          $lookup: {
            from: "Property", // Assuming property details are stored in "Property"
            localField: "property_Id", // field in Request that stores property reference
            foreignField: "_id",
            as: "propertyInfo",
          },
        },
        {
          $unwind: "$propertyInfo",
        },
        {
          $project: {
            _id: 1,
            user_Id: 1,
            property_Id: 1,
            owner_Id: 1,
            startDate: 1,
            endDate: 1,
            status: 1,
            bookingDate: 1,
            propertyName: "$propertyInfo.title",
            propertyLocation: "$propertyInfo.location",
            propertyPrice: "$propertyInfo.price",
          },
        },
      ])
      .toArray();

    if (requests.length === 0) {
      res.status(404).json({ message: "No Booking Found" });
    } else {
      res.status(200).json({
        message: "Booking request found successfully",
        data: requests,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
  }
}

module.exports = { get_user_booking };
