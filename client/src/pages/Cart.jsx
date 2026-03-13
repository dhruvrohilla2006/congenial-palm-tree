import { useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../api/axios.js";
import { useCartStore } from "../store/cartStore.js";

const CartPage = () => {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const total = items.reduce(
    (sum, it) => sum + Number(it.food.price || 0) * it.quantity,
    0,
  );

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        items: items.map((it) => ({
          food: it.food._id,
          quantity: it.quantity,
        })),
      };
      await api.post("/orders", payload);
      clear();
      setSuccess("Order placed successfully.");
      setTimeout(() => navigate("/orders/my", { replace: true }), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-base-content/70">
          Browse the menu and add some delicious items.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your cart</h1>
      </div>
      {error && <div className="alert alert-error text-sm">{error}</div>}
      {success && <div className="alert alert-success text-sm">{success}</div>}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-3">
          {items.map((it) => (
            <div key={it.food._id} className="card bg-base-100 shadow">
              <div className="card-body flex flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  <h2 className="card-title text-base">{it.food.name}</h2>
                  <p className="text-sm text-base-content/70 line-clamp-2">
                    {it.food.description}
                  </p>
                  <p className="mt-1 text-sm">
                    Price:{" "}
                    <span className="font-semibold">
                      ${Number(it.food.price).toFixed(2)}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm">
                    Qty: <span className="font-semibold">{it.quantity}</span>
                  </span>
                  <span className="font-semibold">
                    ${(Number(it.food.price) * it.quantity).toFixed(2)}
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline btn-error btn-xs"
                    onClick={() => removeItem(it.food._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="card bg-base-100 shadow h-fit">
          <div className="card-body space-y-3">
            <h2 className="card-title text-lg">Summary</h2>
            <div className="flex items-center justify-between">
              <span>Total</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
            <button
              type="button"
              className={`btn btn-primary w-full ${
                submitting ? "loading" : ""
              }`}
              disabled={submitting || items.length === 0}
              onClick={handlePlaceOrder}
            >
              {submitting ? "Placing order..." : "Place order"}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm w-full"
              onClick={clear}
              disabled={submitting}
            >
              Clear cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

