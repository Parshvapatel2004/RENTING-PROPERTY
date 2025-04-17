const { ObjectId } = require("mongodb");
const connectDB = require("../DB/connectDB");

async function edit_property(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Property");

    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const owner_Id = user.session._id;
    const { property_Id } = req.body; // Property ID to update

    if (!property_Id) {
      return res.status(400).json({ message: "Property ID is required" });
    }

    // Fetch existing property details
    const existingProperty = await collection.findOne({
      _id: ObjectId.createFromHexString(property_Id),
      owner_Id: ObjectId.createFromHexString(owner_Id),
    });

    if (!existingProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Prepare updated fields, keeping existing values if not provided
    const updatedProperty = {
      title: req.body.title || existingProperty.title,
      description: req.body.description || existingProperty.description,
      location: req.body.location || existingProperty.location,
      address: req.body.address || existingProperty.address,
      zipCode: req.body.zipCode || existingProperty.zipCode,
      propertyType: req.body.propertyType || existingProperty.propertyType,
      category: req.body.category || existingProperty.category,
      size: req.body.size ? parseFloat(req.body.size) : existingProperty.size,
      price: req.body.price
        ? parseFloat(req.body.price)
        : existingProperty.price,
      bedrooms: req.body.bedrooms
        ? parseInt(req.body.bedrooms)
        : existingProperty.bedrooms,
      bathrooms: req.body.bathrooms
        ? parseInt(req.body.bathrooms)
        : existingProperty.bathrooms,
      propertyIdentityType:
        req.body.propertyIdentityType || existingProperty.propertyIdentityType,
    };

    // Handle image updates if new images are uploaded
    if (req.files["images"]) {
      updatedProperty.images = req.files["images"].map((file) => file.filename);
    } else {
      updatedProperty.images = existingProperty.images;
    }

    // Handle property proof update
    if (req.files["propertyProof"]) {
      updatedProperty.propertyProof = req.files["propertyProof"][0].filename;
    } else {
      updatedProperty.propertyProof = existingProperty.propertyProof;
    }

    // Handle identity ID update
    if (req.files["identityId"]) {
      updatedProperty.identityId = req.files["identityId"][0].filename;
    } else {
      updatedProperty.identityId = existingProperty.identityId;
    }

    // Handle amenities update
    if (req.body.amenities) {
      updatedProperty.amenities = JSON.parse(req.body.amenities);
    } else {
      updatedProperty.amenities = existingProperty.amenities;
    }

    // Update the property in the database
    await collection.updateOne(
      { _id: ObjectId.createFromHexString(property_Id) },
      { $set: updatedProperty }
    );

    return res.status(200).json({ message: "Property updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { edit_property };
