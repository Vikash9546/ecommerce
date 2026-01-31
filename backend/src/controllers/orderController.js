import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const placeOrder = async (req, res) => {
  const userId = req.userId;

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

export const cancelOrder = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const order = await Order.findOne({ _id: id, userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (["Delivered", "Cancelled"].includes(order.status)) {
      return res.status(400).json({ message: "Order cannot be cancelled" });
    }

    order.status = "Cancelled";
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel order" });
  }
};

export const cancelOrderItem = async (req, res) => {
  const { orderId, itemId } = req.params;
  const userId = req.userId;

  try {
    const order = await Order.findOne({ _id: orderId, userId }).populate("items.productId");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (["Delivered", "Cancelled"].includes(order.status)) {
      return res.status(400).json({ message: "Order cannot be modified" });
    }

    const itemIndex = order.items.findIndex(item => item.productId._id.toString() === itemId || item._id.toString() === itemId);

    if (itemIndex === -1) return res.status(404).json({ message: "Item not found in order" });

    // Remove item
    order.items.splice(itemIndex, 1);

    // Recalculate total logic needs original product price which might be lost if price changed. 
    // Ideally Order should store price snapshot. For now, assuming price is from populated product.
    // However, better way is to Recalculate from remaining items.

    // Actually, simpler fallback if items are empty -> Cancel Order
    if (order.items.length === 0) {
      order.status = "Cancelled";
      order.totalAmount = 0;
    } else {
      order.totalAmount = order.items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);
    }

    await order.save();
    res.json(order);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to cancel item" });
  }
};
