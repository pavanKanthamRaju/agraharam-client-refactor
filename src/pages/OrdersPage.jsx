import React, { useEffect, useState } from "react";
import apiClient from "../utils/appClient";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser).user : null;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get(`/orders/${user.id}`);
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (user?.id) {
      fetchOrders();
    }
  }, [user?.id]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white shadow-md rounded-2xl p-4 border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-orange-600">
                {order.pooja_name}
              </h2>
              <p className="text-gray-700 text-sm">{order.pooja_description}</p>

              <div className="mt-3 text-sm">
                <p><strong>Amount:</strong> ₹{order.total_amount / 100}</p>
                <p><strong>Date:</strong> {order.booking_date}</p>
                <p><strong>Time:</strong> {order.booking_time}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Payment:</strong> {order.payment_status}</p>
                <p><strong>Transaction ID:</strong> {order.transaction_id}</p>
              </div>

              <div className="mt-4 text-right">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${order.payment_status === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {order.payment_status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
