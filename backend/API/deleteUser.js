const connectDB = require("../DB/connectDB");
const { ObjectId } = require("mongodb");

async function DeleteUser(req, res) {
    try {
        const userId = req.params.id;
        const db = await connectDB();
        const collection = db.collection("Register");

        const result = await collection.deleteOne({ _id: new ObjectId(userId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found or already deleted" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { DeleteUser };
