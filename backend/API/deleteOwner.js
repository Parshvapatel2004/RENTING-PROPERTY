const connectDB = require("../DB/connectDB");
const { ObjectId } = require("mongodb");

async function deleteOwner(req, res) {
    try {
        const ownerId = req.params.id;
        const db = await connectDB();
        const collection = db.collection("Register");

        const result = await collection.deleteOne({ _id: new ObjectId(ownerId) });

        if (result.deletedCount == 0) {
            return res.status(404).json({ message: "Owner not found or already deleted" });
        }
        res.status(200).json({ message: "Owner deleted successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { deleteOwner };