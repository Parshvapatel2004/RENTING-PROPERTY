const { ObjectId } = require("mongodb");
const connectDB = require("../DB/connectDB");

async function get_request(req, res) {
  try {
    const db = await connectDB();
    const requestCollection = db.collection("Request");

    const owner = req.session.user;
    if (!owner) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const owner_Id = owner.session._id;

    const requests = await requestCollection
      .aggregate([
        {
          $match: { owner_Id: ObjectId.createFromHexString(owner_Id) },
        },
        {
          $lookup: {
            from: "Register",
            localField: "user_Id",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        {
          $unwind: {
            path: "$userInfo",
            preserveNullAndEmptyArrays: true, // Allow nulls
          },
        },
        {
          $lookup: {
            from: "Property",
            localField: "property_Id",
            foreignField: "_id",
            as: "propertyInfo",
          },
        },
        {
          $unwind: {
            path: "$propertyInfo",
            preserveNullAndEmptyArrays: true, // Allow nulls
          },
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
            userName: {
              $cond: {
                if: { $and: ["$userInfo.firstName", "$userInfo.lastName"] },
                then: {
                  $concat: ["$userInfo.firstName", " ", "$userInfo.lastName"],
                },
                else: null,
              },
            },
            userPhoneNo: "$userInfo.phoneNo",
            propertyTitle: "$propertyInfo.title",
          },
        },
      ])
      .toArray();

    if (requests.length === 0) {
      return res.status(404).json({ message: "No Booking Found" });
    } else {
      return res
        .status(200)
        .json({ message: "Request found successfully", data: requests });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
  }
}

module.exports = { get_request };
