const connectDB = require("../DB/connectDB");
const { ObjectId } = require("mongodb");
const nodemailer = require("nodemailer");

async function respond_complaint(req, res) {
  try {
    const db = await connectDB();
    const complaintCollection = db.collection("Complaint");

    const { complaintId, responseMessage } = req.body;

    if (!complaintId || !responseMessage) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the complaint
    const complaint = await complaintCollection.findOne({
      _id: ObjectId.createFromHexString(complaintId),
    });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // SMTP transporter setup
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "darshanrp20703@gmail.com",
        pass: "nsfbggpjmzryszlj",
      },
    });

    // Email options
    const mailOptions = {
      from: '"RentingProperties" <darshanrp20703@gmail.com>',
      to: complaint.email,
      subject: "Response to Your Complaint",
      text: `Dear ${complaint.name},\n\nThank you for reaching out. Our team has reviewed your complaint, and here is our response:\n\n${responseMessage}\n\nBest regards,\nAdmin Team\nRenting Properties`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Update complaint status and response in the database
    await complaintCollection.updateOne(
      { _id: ObjectId.createFromHexString(complaintId) },
      {
        $set: {
          status: "Resolved",
          response: responseMessage,
        },
      }
    );

    return res
      .status(200)
      .json({ message: "Complaint responded successfully and email sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { respond_complaint };
