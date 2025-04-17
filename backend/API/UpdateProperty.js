const connectDB = require("../DB/connectDB");
const { ObjectId } = require("mongodb");

async function UpdateProperty(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Property");

    const {
      id,
      property_Id,
      owner_Id,
      title,
      description,
      location,
      address,
      zipCode,
      propertyType,
      category,
      size,
      price,
      bedrooms,
      bathrooms,
      images: [],
      propertyIdentityType,
      propertyProof: [],
      amenities: [],
      identityType,
      identityId,
    } = req.body;
    const updateData = {
      $set: {
        property_Id,
        owner_Id,
        title,
        description,
        location,
        address,
        zipCode,
        propertyType,
        category,
        size,
        price,
        bedrooms,
        bathrooms,
        images: [],
        propertyIdentityType,
        propertyProof: [],
        amenities: [],
        identityType,
        identityId,
      },
    };
    const result = await collection.updateOne(
      { _id: ObjectId.createFromHexString(id) },
      updateData
    );
    if (result.modifiedCount == 0) {
      return res.status(400).json({ message: "No data found" });
    } else {
      return res.status(200).json({ message: "Property Updated Successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
  }
}
module.exports = { UpdateProperty };
