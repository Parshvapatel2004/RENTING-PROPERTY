const connectDB = require("../DB/connectDB");


async function FetchAllComplaint(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection("Complaint");
        const userData = await collection.find().toArray();
        if (userData == 0) {
            res.status(404).json({ message: "No Complaint Found" });
        }
        else {
            res.status(200).json({ message: "Complaint found Suceesfully", data: userData })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server Error" });
    }
}

module.exports = { FetchAllComplaint };