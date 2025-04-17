const { ObjectId } = require("mongodb");
const connectDB = require("../DB/connectDB");
const nodemailer = require("nodemailer");

async function RespondToContact(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Contact");
    const { contactId, responseMessage } = req.body;

    if (!contactId || !responseMessage) {
      return res
        .status(400)
        .json({ message: "Contact ID and response are required" });
    }

    const contact = await collection.findOne({
      _id: ObjectId.createFromHexString(contactId),
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // Update response in the database
    await collection.updateOne(
      { _id: ObjectId.createFromHexString(contactId) },
      { $set: { response: responseMessage, status: "Resolved" } }
    );

    // Send email response to user
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "darshanrp20703@gmail.com",
        pass: "nsfbggpjmzryszlj",
      },
    });

    const mailOptions = {
      from: '"RentingProperties" <darshanrp20703@gmail.com>',
      to: contact.email,
      subject: `Response to your inquiry: ${contact.subject}`,
      text: `Hello ${contact.name},\n\nThank you for reaching out. Here is our response:\n\n${responseMessage}\n\nBest regards,\nYour Team\nRenting Properties`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send email" });
      } else {
        return res.status(200).json({ message: "Response sent successfully" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = RespondToContact;
