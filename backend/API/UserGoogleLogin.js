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
      // role: "user",
    };

    // Connect to MongoDB

    const db = await connectDB();
    const usersCollection = db.collection("Register");

    // Check if the user already exists
    const existingUser = await usersCollection.findOne({
      email: userData.email,
    });

    if (!existingUser) {
      // Insert new user if not found
      await usersCollection.insertOne(userData);
    }

    // Generate JWT Token
    const token = jwt.sign(
      { email: userData.email, role: "user" },
      "your_jwt_secret",
      {
        expiresIn: "7d",
      }
    );

    // Save session
    req.session.user = { session: userData, isAuth: true };

    res.json({ token, user: userData });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid Google Token" });
  }
}

module.exports = { GoogleUserLogin };
