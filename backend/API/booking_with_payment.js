const { ObjectId } = require("mongodb");
const connectDB = require("../DB/connectDB");

async function booking_with_payment(req, res) {
  try {
    const db = await connectDB();
    const bookingCollection = db.collection("Booking");
    const paymentCollection = db.collection("Payment");
    const requestCollection = db.collection("Request");

    const user = req.session.user;
    // console.log(user)
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user_Id = user.session._id;
    const fullName = `${user.session.firstName} ${user.session.lastName}`;


    const {
      requestId,
      property_Id,
      owner_Id,
      startDate,
      endDate,
      amount,
      transactionId,
    } = req.body;

    if (
      !requestId ||
      !property_Id ||
      !owner_Id ||
      !startDate ||
      !endDate ||
      !amount ||
      !transactionId
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 1️⃣ Create booking
    const bookingResult = await bookingCollection.insertOne({
      user: fullName,
      user_Id: ObjectId.createFromHexString(user_Id),
      property_Id: ObjectId.createFromHexString(property_Id),
      owner_Id: ObjectId.createFromHexString(owner_Id),
      bookingDate: new Date(),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: "Pending",
    });

    const booking_Id = bookingResult.insertedId;

    // 2️⃣ Add payment entry with booking ID
    await paymentCollection.insertOne({
      user_Id: ObjectId.createFromHexString(user_Id),
      property_Id: ObjectId.createFromHexString(property_Id),
      owner_Id: ObjectId.createFromHexString(owner_Id),
      booking_Id: booking_Id,
      amount: parseFloat(amount),
      paymentDate: new Date(),
      paymentMethod: "Razorpay",
      transactionId,
      status: "Success",
    });

    // 3️⃣ Update Request status to "Paid"
    await requestCollection.updateOne(
      { _id: ObjectId.createFromHexString(requestId) },
      { $set: { status: "Paid" } }
    );
    // 4️⃣ Update Booking status to "Booked"
    await bookingCollection.updateOne(
      { _id: booking_Id },
      { $set: { status: "Booked" } }
    );

    return res.status(201).json({
      message: "Booking and Payment successful. Request marked as Paid.",
      booking_Id: booking_Id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
  }
}

module.exports = { booking_with_payment };
