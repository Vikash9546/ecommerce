import { useEffect, useState } from "react";
import API from "../api/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/order/history").then(res => setOrders(res.data));
  }, []);

  return (
    <div>
      <h2>My Orders</h2>

      {orders.map(order => (
        <div key={order._id} style={{ border: "1px solid #ccc", margin: 10 }}>
          <p>Status: {order.status}</p>
          <p>Total: ₹{order.totalAmount}</p>

          {order.items.map(item => (
            <p key={item._id}>
              {item.productId.name} × {item.quantity}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Orders;
