const connectDB = require("../DB/connectDB");
const { ObjectId } = require("mongodb");

async function FetchAllProperty(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Property");
    const userCollection = db.collection("Register"); // Collection for user details

    const propertyDatas = await collection
      .aggregate([
        {
          $match: { status: "Active" },
        },
        {
          $lookup: {
            from: "Register", // Match with the Register collection
            localField: "owner_Id", // owner_Id in Property collection
            foreignField: "_id", // _id in Register collection
            as: "ownerInfo",
          },
        },
        {
          $unwind: {
            path: "$ownerInfo",
            preserveNullAndEmptyArrays: true, // Ensures properties without owners don't break the response
          },
        },
        {
          $project: {
            _id: 1,
            owner_Id: 1,
            title: 1,
            description: 1,
            location: 1,
            address: 1,
            zipCode: 1,
            propertyType: 1,
            category: 1,
            size: 1,
            price: 1,
            bedrooms: 1,
            bathrooms: 1,
            images: 1,
            propertyIdentityType: 1,
            propertyProof: 1,
            propertyProof: 1,
            amenities: 1,
            status: 1,
            ownerName: {
              $concat: ["$ownerInfo.firstName", " ", "$ownerInfo.lastName"],
            },
            ownerPhoneNo: "$ownerInfo.phoneNo",
          },
        },
      ])
      .toArray();

    if (propertyDatas.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No property Found" });
    } else {
      return res.status(200).json({
        success: true,
        message: "Property found Successfully",
        data: propertyDatas,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
  }
}

module.exports = { FetchAllProperty };
