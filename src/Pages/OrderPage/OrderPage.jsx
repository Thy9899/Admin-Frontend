import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./OrderPage.css";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/orders");
      setOrders(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch orders.");
      console.error("fetchOrders error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirmOrder = async (orderId) => {
    setProcessingId(orderId);
    try {
      const res = await axios.post(
        `http://localhost:8000/api/order_items/${orderId}/accept`
      );
      if (res && (res.status === 200 || res.status === 201)) {
        toast.success("Order confirmed!");
        await fetchOrders();
      }
    } catch (err) {
      toast.error("Failed to confirm order.");
      console.error("confirm error:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancelOrder = async (orderId) => {
    setProcessingId(orderId);
    try {
      const res = await axios.post(
        `http://localhost:8000/api/order_items/${orderId}/cancel`
      );
      if (res && (res.status === 200 || res.status === 201)) {
        toast.info("Order cancelled.");
        await fetchOrders();
      }
    } catch (err) {
      toast.error("Failed to cancel order.");
      console.error("cancel error:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const formatMoney = (val) =>
    val != null && !Number.isNaN(Number(val))
      ? `$${Number(val).toFixed(2)}`
      : "-";

  return (
    <div className="admin-orders-container">
      <h2>All Orders</h2>

      <ToastContainer position="top-right" autoClose={3000} />

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Subtotal</th>
              <th>Total</th>
              <th>Payment Method</th>
              <th>Shipping Address</th>
              <th>Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.status}</td>
                <td>{formatMoney(order.subtotal)}</td>
                <td>{formatMoney(order.total)}</td>
                <td>{order.payment_method ?? "-"}</td>
                <td>
                  {order.shipping_address
                    ? `${order.shipping_address.line1 ?? ""}${
                        order.shipping_address.city
                          ? ", " + order.shipping_address.city
                          : ""
                      }`
                    : "-"}
                </td>
                <td>
                  {Array.isArray(order.items) && order.items.length
                    ? order.items
                        .map(
                          (i) =>
                            `${i.product?.name ?? i.name ?? "Item"} x ${
                              i.quantity ?? 1
                            }`
                        )
                        .join(", ")
                    : "-"}
                </td>
                <td>
                  {order.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleConfirmOrder(order.id)}
                        className="btn btn-success"
                        disabled={processingId === order.id}
                      >
                        {processingId === order.id
                          ? "Processing..."
                          : "Confirm"}
                      </button>
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="btn btn-danger"
                        disabled={processingId === order.id}
                        style={{ marginLeft: "8px" }}
                      >
                        {processingId === order.id ? "Processing..." : "Cancel"}
                      </button>
                    </>
                  ) : (
                    <span>
                      ✅{" "}
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderPage;
