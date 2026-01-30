import { useEffect, useState } from "react";
import API from "../api/api";

const Home = () => {
  const [products, setProducts] = useState([]);

  const userId = "user123"; // simple user handling

  useEffect(() => {
    API.get("/products").then((res) => setProducts(res.data));
  }, []);

  const addToCart = async (productId) => {
    await API.post("/cart/add", {
      userId,
      productId,
      quantity: 1,
    });
    alert("Added to cart");
  };

  return (
    <div>
      <h2>Products</h2>
      {products.map((p) => (
        <div key={p._id} style={{ border: "1px solid #ccc", margin: 10 }}>
          <h3>{p.name}</h3>
          <p>₹{p.price}</p>
          <button onClick={() => addToCart(p._id)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default Home;

