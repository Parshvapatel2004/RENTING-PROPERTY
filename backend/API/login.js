const connectDB = require("../DB/connectDB");

async function login(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Register");
    const { email, password } = req.body;
    const userData = await collection.findOne({ email, password });
    if (!userData) {
      res.status(400).json({ message: "Invalid Email or Password" });
    } else {
      //session creation
      req.session.user = { session: userData, isAuth: true };
      const userDatas = req.session.user;
      res.status(200).json({
        message: "Login Successfully",
        success: true,
        userDetails: userDatas,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { login };
