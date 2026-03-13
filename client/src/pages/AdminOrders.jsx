import { useEffect, useState } from "react";
import { api } from "../api/axios.js";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const res = await api.put(`/orders/${id}`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? res.data : o)),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All orders</h1>
      </div>
      {error && <div className="alert alert-error text-sm">{error}</div>}
      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p className="text-sm text-base-content/70">No orders yet.</p>
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 shadow">
          <div className="card-body overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <div className="flex flex-col">
                        <span className="font-mono text-xs">
                          #{order._id.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-xs text-base-content/70">
                          {new Date(order.createdAt).toLocaleString(undefined, {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {order.user?.name || "Unknown"}
                        </span>
                        <span className="text-xs text-base-content/70">
                          {order.user?.email}
                        </span>
                      </div>
                    </td>
                    <td className="font-semibold">
                      ${Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td>
                      <select
                        className="select select-bordered select-xs"
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateOrderStatus(order._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="text-xs text-base-content/70">
                      {new Date(
                        order.updatedAt || order.createdAt,
                      ).toLocaleString(undefined, {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;

