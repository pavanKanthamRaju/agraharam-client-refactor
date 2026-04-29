// import React, { useEffect, useState } from "react";
// import {getAllOrders } from "../../api/dashboardsApi";

// const OrdersPage = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await getAllOrders();
//         debugger
//         setOrders(res.orders);
//       } catch (err) {
//         console.error("Error fetching orders:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrders();
//   }, []);

//   if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left mb-8">All Orders</h1>

//       {orders.length === 0 ? (
//         <p>No orders found.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-300 rounded-lg">
//             <thead className=" bg-gradient-to-r from-orange-300 to-orange-400">
//               <tr>
//                 <th className="p-2 border">Order ID</th>
//                 <th className="p-2 border">User Name</th>
//                 <th className="p-2 border">Pooja</th>
//                 <th className="p-2 border">Total</th>
//                 <th className="p-2 border">Status</th>
//                 <th className="p-2 border">Address</th>
//                 <th className="p-2 border">Phone Number</th>
//                 <th className="p-2 border">Created At</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order.order_id} className="hover:bg-gray-50">
//                   <td className="p-2 border">{order.order_id}</td>
//                   <td className="p-2 border">{order.user_name}</td>
//                   <td className="p-2 border">{order.pooja_name}</td>
//                   <td className="p-2 border">₹{order.total_amount / 100}</td>
//                   <td className="p-2 border text-green-700 font-medium">{order.payment_status}</td>
//                   <td className="p-2 border text-green-700 font-medium">{order.address}</td>
//                   <td className="p-2 border text-green-700 font-medium">{order.phone_number}</td>
//                   <td className="p-2 border">
//                     {new Date(order.created_at).toLocaleString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrdersPage;

import React, { useEffect, useState } from "react";
import { getAllOrders } from "../../api/dashboardsApi";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // default latest first

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getAllOrders();
        setOrders(res.orders);
        setFilteredOrders(res.orders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // 🔍 FILTER LOGIC
  useEffect(() => {
    const searchTerm = search.toLowerCase();

    const filtered = orders.filter((order) => {
      return (
        order.order_id?.toString().includes(searchTerm) ||
        order.user_name?.toLowerCase().includes(searchTerm) ||
        order.pooja_name?.toLowerCase().includes(searchTerm) ||
        order.phone_number?.toLowerCase().includes(searchTerm) ||
        order.address?.toLowerCase().includes(searchTerm) ||
        // 2. Convert number to string before lowercasing
        order.total_amount?.toString().toLowerCase().includes(searchTerm) ||
        // 3. Date check
        new Date(order.created_at).toLocaleString().toLowerCase().includes(searchTerm)
      );
    });

    setFilteredOrders(filtered);
  }, [search, orders]);

  // 🔽 SORT LOGIC
  const toggleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);

    const sorted = [...filteredOrders].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);

      return newOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredOrders(sorted);
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        All Orders
      </h1>

      {/* 🔍 SEARCH + SORT BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
        <input
          type="text"
          placeholder="Search by Order ID, name, phone, pooja..."
          className="w-full sm:w-1/3 p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={toggleSort}
          className="px-4 py-2 bg-orange-400 text-white rounded shadow hover:bg-orange-500"
        >
          Sort by Date: {sortOrder === "asc" ? "Old → New" : "New → Old"}
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-gradient-to-r from-orange-300 to-orange-400">
              <tr>
                <th className="p-2 border">Order ID</th>
                <th className="p-2 border">User Name</th>
                <th className="p-2 border">Pooja</th>
                <th className="p-2 border">Total</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Address</th>
                <th className="p-2 border">Phone Number</th>
                <th className="p-2 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.order_id} className="hover:bg-gray-50">
                  <td className="p-2 border">{order.order_id}</td>
                  <td className="p-2 border">{order.user_name}</td>
                  <td className="p-2 border">{order.pooja_name}</td>
                  <td className="p-2 border">₹{order.total_amount / 100}</td>
                  <td className="p-2 border text-green-700 font-medium">
                    {order.payment_status}
                  </td>
                  <td className="p-2 border">{order.address}</td>
                  <td className="p-2 border">{order.phone_number}</td>
                  <td className="p-2 border">
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

