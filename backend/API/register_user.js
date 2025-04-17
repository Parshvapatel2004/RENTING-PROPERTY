const connectDB = require("../DB/connectDB");
const nodemailer = require("nodemailer");

async function register_user(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Register");

    const { firstName, lastName, email, phoneNo, password } = req.body;
    if (!firstName || !lastName || !email || !phoneNo || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists:
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email" });
    }
    await collection.insertOne({
      firstName,
      lastName,
      email,
      phoneNo,
      password,
      role: "user",
      createdAt: new Date().toISOString().split("T")[0],
    });


    // SMTP transporter setup
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: "darshanrp20703@gmail.com",
        pass: "nsfbggpjmzryszlj", // App password (never share publicly)
      },
    });

    // Email options for registered user
    const mailOptions = {
      from: '"RentingProperties" <darshanrp20703@gmail.com>',
      to: email, 
      subject: "Welcome to RentingProperties!",
      text: `Dear ${firstName} ${lastName},

Thank you for registering with RentingProperties.

We are excited to have you on board! You can now explore, rent, and manage properties more efficiently through our platform.

If you have any questions or need help, feel free to contact our support team.

Best regards,  
Admin Team  
RentingProperties`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");



    return res.status(200).json({ message: "User Register Successfully" });

    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
  }
}

module.exports = { register_user };
