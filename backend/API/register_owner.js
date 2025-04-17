const { ObjectId } = require("mongodb");
const connectDB = require("../DB/connectDB");
const nodemailer = require("nodemailer");

async function register_owner(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Register");


    // Check if required fields are present
    const { firstName, lastName, email, phoneNo, password } = req.body;

    // l_Id file handling:
    const l_IdFile = req.files?.l_Id?.[0] ? req.files.l_Id[0].filename : null;
    const l_Id = l_IdFile || null;


    // Check if user already exists:
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Owner already exists with this email" });
    }
    // Create new user object
    const newUser = {
      firstName,
      lastName,
      email,
      phoneNo,
      l_Id,
      password,
      role: "owner",
      createdAt: new Date().toISOString().split("T")[0],
    };

    // Insert into DB
    await collection.insertOne(newUser);

    // SMTP transporter setup
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for port 465, false for others
      auth: {
        user: "darshanrp20703@gmail.com",
        pass: "nsfbggpjmzryszlj", // App password
      },
    });

    // Email options for registered owner
    const mailOptions = {
      from: '"RentingProperties" <darshanrp20703@gmail.com>',
      to: email,
      subject: "Welcome to RentingProperties!",
      text: `Dear ${firstName} ${lastName},

Thank you for registering as a property owner on RentingProperties.

You can now list your properties, manage tenant requests, and get better visibility through our platform.

If you need help setting up your first property listing, our support team is here to assist you.

Looking forward to a great partnership!

Best regards,  
Admin Team  
RentingProperties`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Owner registration email sent successfully");

    // Send success response
    return res.status(201).json({ message: "Owner registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { register_owner };
