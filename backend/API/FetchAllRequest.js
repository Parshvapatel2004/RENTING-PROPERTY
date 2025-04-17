const connectDB = require("../DB/connectDB");


async function FetchAllRequest(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection("Request");
        const userData = await collection.find().toArray();
        if (userData == 0) {
            res.status(404).json({ message: "No Request Found" });
        }
        else {
            res.status(200).json({ message: "Request found Suceesfully", userDetails: userData })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server Error" });
    }
}

module.exports = { FetchAllRequest };