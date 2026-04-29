// import React, { useState, useEffect } from "react";
// import Modal from "./components/Modal";
// import ItemForm from "./components/ItemForm";
// import { createItem, updateItem,getAllItems,deleteItem } from "../../api/dashboardsApi";


// const ItemsPaage = () => {
//   const [items, setItems] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);

//   // ✅ Fetch all items
//   const fetchItems = async () => {
//     const res = await getAllItems();
//     const data =res.items;
//  setItems(data);
//   };

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   // ✅ Create or Update item
//   const handleSubmit = async (itemData) => {

//     try {
//       const res = selectedItem?
//        await updateItem(selectedItem.id,itemData)
//         :   await createItem(itemData);
//       if (res.success) {
//         fetchItems();
//         setIsModalOpen(false);
//         setSelectedItem(null);
//       }
//     } catch (error) {
//       console.error("Error saving item:", error);
//     }
//   };

//   // ✅ Delete item
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this item?")) return;
//     try {
//       const res = await deleteItem(id)
//       if (res.success) fetchItems();
//     } catch (error) {
//       console.error("Error deleting item:", error);
//     }
//   };

//   return (
//     <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
//       {/* Header Section */}
//       <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">Manage Items</h1>
//         <button
//           onClick={() => {
//             setSelectedItem(null);
//             setIsModalOpen(true);
//           }}
//           className="w-full sm:w-auto  bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md active:scale-95 transition"
//         >
//           + Create Item
//         </button>
//       </div>

//       {/* Cards Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {items.map((item) => (
//           <div
//             key={item.id}
//             className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-100"
//           >
//             {/* Card Header */}
//             <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-orange-300 to-orange-400 border-b">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 {item.name}
//               </h2>
//               {item.price && (
//                 <span className="text-blue-700 font-semibold">
//                   ₹{item.price}
//                 </span>
//               )}
//             </div>

//             {/* Card Body */}
//             <div className="p-4">
//               <p className="text-gray-600 text-sm leading-relaxed">
//                 {item.description || "No description provided."}
//               </p>
//             </div>

//             {/* Card Footer */}
//             <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-700">
//               <button
//                 onClick={() => {
//                   setSelectedItem(item);
//                   setIsModalOpen(true);
//                 }}
//                 className="relative overflow-hidden px-4 py-2 rounded-md bg-blue-500 text-white text-sm font-medium shadow-sm hover:bg-blue-600 active:scale-95 transition"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDelete(item.id)}
//                 className="relative overflow-hidden px-4 py-2 rounded-md bg-red-500 text-white text-sm font-medium shadow-sm hover:bg-red-600 active:scale-95 transition"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Empty State */}
//       {items.length === 0 && (
//         <p className="text-center text-gray-500 mt-8">
//           No items available. Click “Create Item” to add one.
//         </p>
//       )}

//       {/* Modal for Create / Edit */}
//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <ItemForm
//           existingItem={selectedItem}
//           onSubmit={handleSubmit}
//           onClose={() => setIsModalOpen(false)}
//         />
//       </Modal>
//     </div>
//   );
// };

// export default ItemsPaage;

import React, { useState, useEffect } from "react";
import Modal from "./components/Modal";
import ItemForm from "./components/ItemForm";
import * as XLSX from "xlsx";
import { FiDownload } from "react-icons/fi"; // Download icon


import { createItem, updateItem, getAllItems, deleteItem } from "../../api/dashboardsApi";

const ItemsPaage = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [fiterdItems, setFilterdItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false); // spinner state

  // ✅ Fetch all items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await getAllItems();
      const data = res.items;
      // Sort alphabetically every time data is fetched
      const sortedData = [...data].sort((a, b) =>
        a.name?.localeCompare(b.name)  // change 'name' to your property
      );
      setItems(sortedData);
      setFilterdItems(sortedData);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const searchString = search.toLowerCase();
    const fiterdData = items.filter((item) =>
      item.name.toLowerCase().includes(searchString)
    )
    const sortedData = [...fiterdData].sort((a, b) =>
      a.name?.localeCompare(b.name)  // change 'name' to your property
    );
    setFilterdItems(sortedData);
  }, [items, search])

  // ✅ Create or Update item
  const handleSubmit = async (itemData) => {
    try {
      setLoading(true);
      const res = selectedItem
        ? await updateItem(selectedItem.id, itemData)
        : await createItem(itemData);

      if (res.success) {
        await fetchItems();
        setIsModalOpen(false);
        setSelectedItem(null);
      }
    } catch (error) {
      alert(error.message)
      console.error("Error saving item:", error);

    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete item
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      setLoading(true);
      const res = await deleteItem(id);
      if (res.success) fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDownloadExcel = () => {
    if (!items?.length) return;

    // 1. Convert data to a worksheet
    // If you want specific columns in specific order, map first:
    const dataForExcel = items.map(item => ({
      Name: item.name,
      Price: item.price,
      Description: item.description
    }));


    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);

    // 2. Create a workbook and append the sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Items");

    // 3. Trigger download
    XLSX.writeFile(workbook, "items.xlsx");
  };

  return (
    <div className="relative p-4 sm:p-6 bg-gray-100 min-h-screen">
      {/* 🔹 Spinner Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
          Manage Items
        </h1>
        <div className="flex gap-3">
          <button
            className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md active:scale-95 transition"
            onClick={handleDownloadExcel}>
            <FiDownload className="w-4 h-4 inline mr-1" />
            Download Items as Excel
          </button>

          <button
            onClick={() => {
              setSelectedItem(null);
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md active:scale-95 transition"
          >
            + Create Item
          </button>
        </div>
      </div>
      {/* 🔍 SEARCH + SORT BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
        <input
          type="text"
          placeholder="Search by Item name "
          className="w-full sm:w-1/3 p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />


      </div>
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fiterdItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col h-full bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-100"
          >
            {/* Card Header */}
            <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-orange-300 to-orange-400 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h2>
              {item.price && (
                <span className="text-blue-700 font-semibold">
                  ₹{item.price}
                </span>
              )}
            </div>

            {/* Card Body */}
            <div className="p-4 flex-grow">
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description || "No description provided."}
              </p>
            </div>

            {/* Card Footer */}
            <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-700">
              <button
                onClick={() => {
                  setSelectedItem(item);
                  setIsModalOpen(true);
                }}
                className="relative overflow-hidden px-4 py-2 rounded-md bg-blue-500 text-white text-sm font-medium shadow-sm hover:bg-blue-600 active:scale-95 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="relative overflow-hidden px-4 py-2 rounded-md bg-red-500 text-white text-sm font-medium shadow-sm hover:bg-red-600 active:scale-95 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {fiterdItems.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-8">
          No items available. Click “Create Item” to add one.
        </p>
      )}

      {/* Modal for Create / Edit */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ItemForm
          existingItem={selectedItem}
          onSubmit={handleSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ItemsPaage;

