const { ObjectId } = require("mongodb");
const connectDB = require("../DB/connectDB");

async function manage_property(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Property");

    const owner = req.session.user;
    if (!owner) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const owner_Id = owner.session._id;

    const property = await collection
      .find({
        owner_Id: ObjectId.createFromHexString(owner_Id),
        status: "Active",
      })
      .toArray();

    if (property.length === 0) {
      res.status(404).json({ message: "No Property Found" });
    } else {
      res.status(200).json({
        success: true,
        message: "Property found Suceesfully",
        data: property,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
  }
}

module.exports = { manage_property };
