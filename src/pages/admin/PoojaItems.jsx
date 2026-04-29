import React, { useEffect, useState } from "react";
import ItemForm from "./components/ItemForm"

const PoojaItems = () => {
  const base_path = process.env.REACT_APP_BASE_URL;
  const [items, setItems] = useState([]);
  const [selectedPooja, setSelectedPooja] = useState("");
  const [poojas, setPoojas] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);



  const fetchPoojas = React.useCallback(async () => {
    const res = await fetch(`${base_path}/api/poojas`);
    const data = await res.json();
    setPoojas(data);
  }, [base_path]);

  const fetchItems = React.useCallback(async (poojaId = "") => {
    const url = poojaId
      ? `${base_path}/api/items/pooja/${poojaId}`
      : `${base_path}/api/items`;
    const res = await fetch(url);
    const data = await res.json();
    setItems(data);
  }, [base_path]);

  useEffect(() => {
    fetchPoojas();
    fetchItems();
  }, [fetchPoojas, fetchItems]);

  const handlePoojaChange = (e) => {
    const poojaId = e.target.value;
    setSelectedPooja(poojaId);
    fetchItems(poojaId);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSave = async (newItem) => {
    if (editingItem) {
      // Update item
      await fetch(`${base_path}/api/items/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
    } else {
      // Create item
      await fetch(`$base_path}/api/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
    }
    setShowForm(false);
    setEditingItem(null);
    fetchItems(selectedPooja);
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">Manage Items</h2>
        <button
          className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-md font-medium shadow-md transition hover:bg-blue-700 active:scale-95 text-center"
          onClick={() => setShowForm(true)}
        >
          + Add Item
        </button>
      </div>

      {/* Filter by Pooja */}
      <div className="mb-4">
        <label className="font-medium mr-2">Filter by Pooja:</label>
        <select
          value={selectedPooja}
          onChange={handlePoojaChange}
          className="border rounded-md px-3 py-2"
        >
          <option value="">All</option>
          {poojas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Items Table */}
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border-b">Item Name</th>
            <th className="px-4 py-2 border-b">Price (₹)</th>
            <th className="px-4 py-2 border-b">Pooja</th>
            <th className="px-4 py-2 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{item.name}</td>
              <td className="px-4 py-2 border-b">{item.price}</td>
              <td className="px-4 py-2 border-b">{item.pooja_name}</td>
              <td className="px-4 py-2 border-b text-center">
                <button
                  className="text-blue-600 hover:underline mr-3"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Item Form Modal */}
      {showForm && (
        <ItemForm
          item={editingItem}
          poojas={poojas}
          onClose={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default PoojaItems;
