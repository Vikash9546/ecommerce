import { useEffect, useState } from "react";
import API from "../api/api";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const userId = "user123";

  useEffect(() => {
    API.get(`/cart/${userId}`).then((res) => setCart(res.data));
  }, []);

  const placeOrder = async () => {
    await API.post("/order/place", { userId });
    alert("Order placed successfully");
    setCart(null);
  };

  if (!cart || cart.items.length === 0) return <h3>Cart is empty</h3>;

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.items.map((item) => (
        <div key={item.productId._id}>
          <p>
            {item.productId.name} × {item.quantity}
          </p>
        </div>
      ))}
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
};

export default Cart;
