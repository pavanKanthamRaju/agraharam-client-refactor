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
          {orders.map((order) => {
            let displayTitle = order.pooja_name || "Pooja Items Purchase";
            let displayDesc = order.pooja_description || "Standalone Pooja Items Order";
            let displayAddress = order.address;
            let parsedAddress = null;

            try {
              if (order.address && order.address.startsWith("{")) {
                parsedAddress = JSON.parse(order.address);
                if (parsedAddress.isStandaloneItems) {
                  displayTitle = parsedAddress.items.map(i => `${i.name} (x${i.quantity})`).join(", ");
                  displayDesc = parsedAddress.items.map(i => i.description || "Ritual samagri").join("; ");
                  displayAddress = parsedAddress.deliveryAddress;
                } else if (parsedAddress.isStandaloneNivedyams) {
                  displayTitle = parsedAddress.nivedyams.map(i => `${i.name} (x${i.quantity})`).join(", ");
                  displayDesc = parsedAddress.nivedyams.map(i => i.description || "Ritual offering").join("; ");
                  displayAddress = parsedAddress.deliveryAddress;
                } else if (parsedAddress.isPoojaBooking) {
                  displayAddress = parsedAddress.deliveryAddress;
                }
              }
            } catch (e) {
              console.error("Error parsing address JSON:", e);
            }

            return (
              <div
                key={order.order_id}
                className="bg-white shadow-md rounded-2xl p-4 border border-gray-100 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-orange-600">
                    {displayTitle}
                  </h2>
                  <p className="text-gray-700 text-sm mt-1">{displayDesc}</p>

                  <div className="mt-3 text-sm space-y-1">
                    <p><strong>Amount:</strong> ₹{order.total_amount / 100}</p>
                    <p>
                      <strong>
                        {parsedAddress?.isStandaloneItems || parsedAddress?.isStandaloneNivedyams
                          ? "Order Date:"
                          : "Pooja Date:"}
                      </strong>{" "}
                      {order.booking_date}
                    </p>
                    <p>
                      <strong>
                        {parsedAddress?.isStandaloneItems || parsedAddress?.isStandaloneNivedyams
                          ? "Order Time:"
                          : "Pooja Time:"}
                      </strong>{" "}
                      {order.booking_time}
                    </p>
                    <p><strong>Address:</strong> {displayAddress}</p>
                    <p><strong>Payment:</strong> {order.payment_status}</p>
                    <p><strong>Transaction ID:</strong> {order.transaction_id}</p>
                  </div>

                  {parsedAddress?.isPoojaBooking && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                      {parsedAddress.items && parsedAddress.items.length > 0 && (
                        <div className="text-xs text-gray-600 bg-orange-50/50 p-2 rounded border border-orange-100/50">
                          <strong className="text-orange-800">Pooja Items:</strong>{" "}
                          {parsedAddress.items.map(i => `${i.name} (x${i.quantity})`).join(", ")}
                        </div>
                      )}
                      {parsedAddress.nivedyams && parsedAddress.nivedyams.length > 0 && (
                        <div className="text-xs text-gray-600 bg-orange-50/50 p-2 rounded border border-orange-100/50">
                          <strong className="text-orange-800">Nivedyams:</strong>{" "}
                          {parsedAddress.nivedyams.map(i => `${i.name} (x${i.quantity})`).join(", ")}
                        </div>
                      )}
                    </div>
                  )}
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
