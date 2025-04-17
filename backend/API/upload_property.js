const { ObjectId } = require("mongodb");
const connectDB = require("../DB/connectDB");

async function upload_property(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Property");

    const {
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
      propertyIdentityType,
      amenities,
    } = req.body;

    // parse amenities array from JSON string
    const amenitiesArray = amenities ? JSON.parse(amenities) : [];

    // map image file names
    const images = req.files["images"]
      ? req.files["images"].map((file) => file.filename)
      : [];

    const propertyProof = req.files["propertyProof"]
      ? req.files["propertyProof"][0].filename
      : null;

    const identityId = req.files["identityId"]
      ? req.files["identityId"][0].filename
      : null;

    if (
      !title ||
      !description ||
      !location ||
      !address ||
      !zipCode ||
      !propertyType ||
      !category ||
      !size ||
      !price ||
      !bedrooms ||
      !bathrooms ||
      images.length === 0 ||
      !propertyIdentityType ||
      !propertyProof ||
      amenitiesArray.length === 0
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const owner = req.session.user;
    if (!owner) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const owner_Id = owner.session._id;

    await collection.insertOne({
      owner_Id: ObjectId.createFromHexString(owner_Id),
      title,
      description,
      location,
      address,
      zipCode,
      propertyType,
      category,
      size: parseFloat(size),
      price: parseFloat(price),
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      images,
      propertyIdentityType,
      propertyProof,
      amenities: amenitiesArray,
      status: "Active",
    });

    return res.status(200).json({ message: "Property uploaded Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
  }
}

module.exports = { upload_property };
