import React, { useState, useEffect, useCallback } from "react";
import {
  getPoojaItemsByid,
  getAllItems,
  addPoojaItem,
  deletePoojaItem,
} from "../../../api/dashboardsApi";

const PoojaItemsForm = ({ pooja, onClose }) => {
  const [itemsList, setItemsList] = useState([]);
  const [poojaItems, setPoojaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // new spinner for save/delete 

  const fetchItemsAndPoojaData = useCallback(async () => {
    try {
      setLoading(true);
      const [itemsData, poojaItemsData] = await Promise.all([
        getAllItems(),
        getPoojaItemsByid(pooja.id),
      ]);
      const formattedPoojaItems = poojaItemsData.map((item) => ({
        ...item,
        isExisting: true,
        default_price: item.price / item.quantity
      }));
      setItemsList(itemsData.items);
      setPoojaItems(formattedPoojaItems);
    } catch (error) {
      console.error("Error loading pooja items:", error);
    } finally {
      setLoading(false);
    }
  }, [pooja?.id]);

  useEffect(() => {
    if (pooja?.id) {
      fetchItemsAndPoojaData();
    }
  }, [pooja, fetchItemsAndPoojaData]);

  const handleAddItem = () => {
    setPoojaItems((prev) => [
      ...prev,
      { item_id: "", quantity: 1, price: 0, isExisting: false },
    ]);
  };

  const handleChange = (index, field, value) => {
    setPoojaItems((prev) =>
      prev.map((item, i) => {
        // i === index ? { ...item, [field]: value } : item
        if (i === index) {
          if (field === "quantity") {
            const unitPrice = item.default_price || 0;
            return { ...item, [field]: value, price: (value * unitPrice).toFixed(2) }
          }
          return { ...item, [field]: value }
        } else {
          return item
        }
      }
      )

    );
  };

  const handleItems = (index, field, selctedItemid) => {

    let isItemExist = poojaItems.find(item => item.item_id === parseInt(selctedItemid));
    if (isItemExist) {
      alert("Item Allready Added please delete or update the existing Item....")
      return
    }
    const selectedItem = itemsList.find(item => item.id === parseInt(selctedItemid))
    setPoojaItems((prev) =>
      prev.map((item, i) => {
        // i === index ? { ...item, [field]: value } : item
        if (i === index) {

          const unitPrice = itemsList.find(it => it.id === parseInt(selctedItemid)).price / itemsList.find(it => it.id === parseInt(selctedItemid)).default_quantity;
          return { ...item, [field]: selectedItem.id, price: selectedItem.price, quantity: selectedItem.default_quantity, units: selectedItem.units, default_price: unitPrice }
        }
        return item

      }
      )

    );
  };

  const handleDeleteItem = async (index, item) => {
    if (item.isExisting && item.id) {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this item?"
      );
      if (!confirmDelete) return;

      try {
        setSaving(true);
        await deletePoojaItem(item.id);
        setPoojaItems((prev) => prev.filter((_, i) => i !== index));
      } catch (error) {
        console.error("Error deleting pooja item:", error);
      } finally {
        setSaving(false);
      }
    } else {
      setPoojaItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = async (item) => {
    try {
      setSaving(true);
      await addPoojaItem({
        pooja_id: pooja.id,
        item_id: item.item_id,
        quantity: item.quantity,
        price: item.price,
        units: item.units
      });
      alert("Item saved successfully!");
      fetchItemsAndPoojaData(); // refresh after save
    } catch (error) {
      console.error("Error saving pooja items:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="relative overflow-y-scroll max-h-[400px]">
      {/* Spinner overlay for saving */}
      {saving && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="hidden sm:grid grid-cols-12 gap-4 items-center border p-2 rounded-lg shadow-sm bg-gray-100 font-bold text-sm">
        <label className="col-span-4">Item</label>
        <label className="col-span-2">Quantity</label>
        <label className="col-span-2">Units</label>
        <label className="col-span-2">Price</label>
        <label className="col-span-2 text-center">Actions</label>
      </div>

      {poojaItems.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center border p-4 sm:p-2 rounded-lg shadow-sm mt-2"
        >
          {/* Mobile Label */}
          <span className="sm:hidden font-bold">Item:</span>
          <div className="col-span-1 sm:col-span-4">
            <select
              className="border p-2 rounded w-full"
              value={item.item_id || ""}
              onChange={(e) => handleItems(index, "item_id", e.target.value)}
            >
              <option value="">Select Item</option>
              {itemsList.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.name}
                </option>
              ))}
            </select>
          </div>

          <span className="sm:hidden font-bold">Quantity:</span>
          <div className="col-span-1 sm:col-span-2">
            <input
              type="string"
              placeholder="Qty"
              className="border p-2 rounded w-full"
              value={item.quantity}
              onChange={(e) => handleChange(index, "quantity", e.target.value)}
            />
          </div>

          <span className="sm:hidden font-bold">Units:</span>
          <div className="col-span-1 sm:col-span-2">
            <input
              type="string"
              placeholder="Units"
              className="border p-2 rounded w-full"
              value={item.units}
              onChange={(e) => handleChange(index, "units", e.target.value)}
              disabled
            />
          </div>

          <span className="sm:hidden font-bold">Price:</span>
          <div className="col-span-1 sm:col-span-2">
            <input
              type="number"
              placeholder="Price"
              className="border p-2 rounded w-full"
              value={item.price}
              onChange={(e) => handleChange(index, "price", e.target.value)}
              disabled
            />
          </div>

          <div className="col-span-1 sm:col-span-2 flex justify-center mt-2 sm:mt-0">
            {item.isExisting ? (
              <button
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded w-full sm:w-auto"
                onClick={() => handleDeleteItem(index, item)}
              >
                Delete
              </button>
            ) : (
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded w-full sm:w-auto"
                onClick={() => handleSave(item)}
              >
                Save
              </button>
            )}
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center mt-4 sticky bottom-0 left-0 bg-white">
        <div className="flex gap-2">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={handleAddItem}
          >
            + Add Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoojaItemsForm;

