import { useEffect, useState } from "react";
import { api } from "../api/axios.js";

const statusBadgeClass = (status) => {
  switch (status) {
    case "Delivered":
      return "badge-success";
    case "Preparing":
      return "badge-warning";
    default:
      return "badge-info";
  }
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my");
        setOrders(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    void fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Orders</h1>
      </div>
      {orders.length === 0 ? (
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p>You have not placed any orders yet.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="card bg-base-100 shadow">
              <div className="card-body">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="card-title text-base">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h2>
                  <span
                    className={`badge badge-sm ${statusBadgeClass(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-base-content/70">
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <div className="mt-2">
                  <ul className="text-sm space-y-1">
                    {order.items.map((item) => (
                      <li key={item._id || `${order._id}-${item.food}`}>
                        <span className="font-medium">
                          {item.food?.name || "Item"}
                        </span>{" "}
                        × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-end mt-2">
                  <span className="font-semibold">
                    Total: ${order.totalAmount?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;

