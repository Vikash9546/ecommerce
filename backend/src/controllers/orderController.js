import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const placeOrder = async (req, res) => {
  const { userId } = req.body;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;

    cart.items.forEach((item) => {
      totalAmount += item.productId.price * item.quantity;
    });

    const order = new Order({
      userId,
      items: cart.items,
      totalAmount,
    });

    await order.save();
    await Cart.deleteOne({ userId });

    res.json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ message: "Order failed" });
  }
};
export const getOrderHistory = async (req, res) => {
  const orders = await Order.find({ userId: req.userId })
    .populate("items.productId")
    .sort({ createdAt: -1 });

  res.json(orders);
};
