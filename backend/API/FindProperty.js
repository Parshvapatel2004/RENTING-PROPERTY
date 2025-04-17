const connectDB = require("../DB/connectDB");

async function search_property(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("Property");

    // Extract search parameters from request body
    const { keywords, maxSqft, propertyType, maxBudget, location } = req.body;

    // Construct the search query - always include status: "Active"
    const query = {
      status: "Active", // Only search for active properties
    };

    const mustConditions = [];
    const orConditions = [];

    // Add keyword search (title, description)
    if (keywords) {
      orConditions.push(
        { title: { $regex: keywords, $options: "i" } },
        { description: { $regex: keywords, $options: "i" } }
      );
    }

    // Add location search (address and location fields)
    if (location) {
      orConditions.push(
        { address: { $regex: location, $options: "i" } },
        { location: { $regex: location, $options: "i" } }
      );
    }

    // Combine text conditions
    if (orConditions.length > 0) {
      mustConditions.push({ $or: orConditions });
    }

    // Add numeric filters
    if (maxSqft) {
      mustConditions.push({ size: { $lte: parseFloat(maxSqft) } });
    }

    if (propertyType) {
      mustConditions.push({ propertyType: propertyType });
    }

    if (maxBudget) {
      mustConditions.push({ price: { $lte: parseFloat(maxBudget) } });
    }

    // Build final query
    if (mustConditions.length > 0) {
      query.$and = mustConditions;
    }

    // If no search criteria provided (other than status), return error
    if (Object.keys(query).length === 1) {
      // Only has status field
      return res.status(400).json({
        message: "Please provide at least one search criteria",
      });
    }

    // Fetch matching properties
    const properties = await collection.find(query).toArray();

    if (properties.length === 0) {
      return res
        .status(404)
        .json({ message: "No active properties found matching your criteria" });
    }

    res.status(200).json({
      message: "Active properties found successfully",
      data: properties,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { search_property };
