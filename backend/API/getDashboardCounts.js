const connectDB = require("../DB/connectDB");

async function getDashboardCounts(req, res) {
  try {
    const db = await connectDB();

    // Get total users count
    const usersCount = await db
      .collection("Register")
      .countDocuments({ role: "user" });

    // Get total owners count
    const ownersCount = await db.collection("Register").countDocuments({
      role: "owner",
    });

    // Get total properties count
    const propertiesCount = await db
      .collection("Property")
      .countDocuments({ status: "Active" });

    // Get total properties count for residential 
    const respropertiesCount= await db
      .collection("Property")
      .countDocuments({ propertyType: "Residential", status: "Active" });

    // Get total properties count for commercial
    const compropertiesCount = await db
      .collection("Property")
      .countDocuments({ propertyType: "Commercial Property", status: "Active" });

// Get total Squared feet for active properties
    const totalSquareFeet = await db
      .collection("Property")
      .aggregate([
        { $match: { status: "Active" } },
        { $group: { _id: null, totalSquareFeet: { $sum: "$size" } } },
      ])
      .toArray();
    const totalSquareFeetValue =
      totalSquareFeet.length > 0 ? totalSquareFeet[0].totalSquareFeet : 0;


    // Get total bookings count
    const bookingsCount = await db.collection("Booking").countDocuments();

    // Get total revenue (sum of all payments)
    const revenueResult = await db
      .collection("Payment")
      .aggregate([{ $group: { _id: null, totalRevenue: { $sum: "$amount" } } }])
      .toArray();
    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalUsers: usersCount,
        totalOwners: ownersCount,
        totalProperties: propertiesCount,
        totalBookings: bookingsCount,
        totalRevenue: totalRevenue,
        totalPropertiesResidential: respropertiesCount,
        totalPropertiesCommercial: compropertiesCount,
        totalSquareFeet: totalSquareFeetValue,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = { getDashboardCounts };
