import Cart from "../models/Cart.js";

export const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    // Return populated cart
    const updatedCart = await Cart.findOne({ userId }).populate("items.productId");
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

export const updateQuantity = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      await cart.save();
      const updatedCart = await Cart.findOne({ userId }).populate("items.productId");
      res.json(updatedCart);
    } else {
      res.status(404).json({ message: "Item not in cart" });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to update quantity" });
  }
};

export const removeFromCart = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    const updatedCart = await Cart.findOne({ userId }).populate("items.productId");
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: "Failed to remove from cart" });
  }
};

export const getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};
