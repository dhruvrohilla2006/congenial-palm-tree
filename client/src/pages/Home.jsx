import { useEffect, useState } from "react";
import { api } from "../api/axios.js";
import FoodCard from "../components/FoodCard.jsx";
import { useCartStore } from "../store/cartStore.js";

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await api.get("/foods");
        setFoods(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load foods");
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  if (loading) {
    return <div className="p-4">Loading foods...</div>;
  }

  if (error) {
    return <div className="p-4 text-error">{error}</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-2">Menu</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {foods.map((food) => (
          <FoodCard key={food._id} food={food} onAdd={addItem} />
        ))}
      </div>
    </div>
  );
};

export default Home;

