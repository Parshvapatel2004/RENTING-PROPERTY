const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const connectDB = require("../DB/connectDB");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function GoogleUserLogin(req, res) {
  try {
    const { credential } = req.body;

    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Extract user details
    const userData = {
      firstName: payload.given_name || "",
      lastName: payload.family_name || "",
      email: payload.email,
    };

    // Connect to MongoDB
    const db = await connectDB();
    const usersCollection = db.collection("Register");

    // Check if the user already exists
    const existingUser = await usersCollection.findOne({
      email: userData.email,
    });

    if (existingUser) {
      console.log("Existing user found:", existingUser);
      // User already exists, so use their existing role
      req.session.user = { session: existingUser, isAuth: true };
    } else {
      // Insert new user if not found
      await usersCollection.insertOne(userData);
      req.session.user = { session: userData, isAuth: true };
    }

    // Generate JWT Token using the role from the database (existing or new user)
    const token = jwt.sign(
      {
        email: userData.email,
        role: existingUser ? existingUser.role : "user",
      },
      "your_jwt_secret",
      { expiresIn: "7d" }
    );

    // Send the response with the token and user details (including role)
    res.json({
      token,
      userDetails: {
        session: userData,
        role: existingUser ? existingUser.role : "user", // Add role to response
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid Google Token" });
  }
}

module.exports = { GoogleUserLogin };
