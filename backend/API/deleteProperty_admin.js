const connectDB = require("../DB/connectDB");
const { ObjectId } = require("mongodb");


async function deleteProperty_admin(req, res) {
    try {
        const propertyId = req.params.id;
        const db = await connectDB();
        const collection = db.collection('Property');
        const result = await collection.deleteOne({ _id: new ObjectId(propertyId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Property not found or already deleted" });
        }
        res.status(200).json({ message: "Property deleted successfully" });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

module.exports = { deleteProperty_admin };
