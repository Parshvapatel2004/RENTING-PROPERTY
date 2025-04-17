const { ObjectId } = require("mongodb");
const connectDB = require("../DB/connectDB");
const nodemailer = require("nodemailer");

async function respond_feedback(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Feedback");
    const { feedbackId, responseMessage } = req.body;

    if (!feedbackId || !responseMessage) {
      return res
        .status(400)
        .json({ message: "Feedback ID and response are required" });
    }

    // Find feedback by ID
    const feedback = await collection.findOne({
      _id: ObjectId.createFromHexString(feedbackId),
    });

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Update feedback with admin response
    await collection.updateOne(
      { _id: ObjectId.createFromHexString(feedbackId) },
      { $set: { response: responseMessage, status: "Resolved" } }
    );

    // Send email notification to user
    await sendEmail(feedback.email, responseMessage);

    return res.status(200).json({ message: "Response sent successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Function to send email using Nodemailer
async function sendEmail(userEmail, responseMessage) {
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
    to: userEmail,
    subject: "Response to Your Feedback",
    html: `
      <p>Dear User,</p>
      <p>Thank you for your feedback. Here is our response:</p>
      <blockquote>${responseMessage}</blockquote>
      <p>Best Regards, <br> Support Team</p>
      <p>Renting Properties</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { respond_feedback };
