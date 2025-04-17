const Razorpay = require("razorpay");

async function GenOrderId(req, res) {
  try {
    const { totalPrice } = req.body;

    if (!totalPrice) {
      return res
        .status(400)
        .json({ success: false, message: "Amount is required" });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const options = {
      amount: parseInt(totalPrice) * 100,
      currency: "INR",
      receipt: "receipt_order_74394",
    };

    const order = await instance.orders.create(options);

    if (!order)
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });

    return res.json({
      success: true,
      message: "Order generated successfully",
      order,
    });
  } catch (error) {
    console.error("GenOrderId.js: ", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

module.exports = { GenOrderId };
