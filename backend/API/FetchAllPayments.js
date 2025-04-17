const connectDB = require("../DB/connectDB");
const { ObjectId } = require("mongodb");

async function FetchAllPayments(req, res) {
  try {
    const db = await connectDB();
    const paymentCollection = db.collection("Payment");
    const userCollection = db.collection("Register");
    const propertyCollection = db.collection("Property");

    const paymentData = await paymentCollection
      .aggregate([
        {
          $lookup: {
            from: "Register", // Fetch user details
            localField: "user_Id",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        {
          $unwind: {
            path: "$userInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "Property", // Fetch property details
            localField: "property_Id",
            foreignField: "_id",
            as: "propertyInfo",
          },
        },
        {
          $unwind: {
            path: "$propertyInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "Register", // Fetch owner details
            localField: "owner_Id",
            foreignField: "_id",
            as: "ownerInfo",
          },
        },
        {
          $unwind: {
            path: "$ownerInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            transactionId: 1,
            amount: 1,
            paymentDate: 1,
            paymentMethod: 1,
            status: 1,
            user_Id: 1,
            property_Id: 1,
            owner_Id: 1,
            userName: {
              $concat: ["$userInfo.firstName", " ", "$userInfo.lastName"],
            },
            propertyName: "$propertyInfo.title",
            ownerName: {
              $concat: ["$ownerInfo.firstName", " ", "$ownerInfo.lastName"],
            },
          },
        },
      ])
      .toArray();

    if (paymentData.length === 0) {
      return res.status(404).json({ message: "No Payment Found" });
    } else {
      return res.status(200).json({
        message: "Payments found successfully",
        payments: paymentData,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
  }
}

module.exports = { FetchAllPayments };
