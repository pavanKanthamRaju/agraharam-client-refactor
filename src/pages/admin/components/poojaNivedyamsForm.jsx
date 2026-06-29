import React, { useState, useEffect, useCallback } from "react";
import {
  getPoojaNivedyamsByPoojaId,
  getAllNivedyams,
  addPoojaNivedyam,
  deletePoojaNivedyam,
} from "../../../api/dashboardsApi";

const PoojaNivedyamsForm = ({ pooja, onClose }) => {
  const [nivedyamsList, setNivedyamsList] = useState([]);
  const [poojaNivedyams, setPoojaNivedyams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchNivedyamsAndPoojaData = useCallback(async () => {
    try {
      setLoading(true);
      const [nivedyamsData, poojaNivedyamsData] = await Promise.all([
        getAllNivedyams(),
        getPoojaNivedyamsByPoojaId(pooja.id),
      ]);
      const formattedNivedyams = (poojaNivedyamsData || []).map((item) => ({
        ...item,
        isExisting: true,
        default_price: item.price / (parseFloat(item.quantity) || 1),
      }));
      const listData = Array.isArray(nivedyamsData) ? nivedyamsData : (nivedyamsData.nivedyams || nivedyamsData.nivedyam || []);
      setNivedyamsList(listData);
      setPoojaNivedyams(formattedNivedyams);
    } catch (error) {
      console.error("Error loading pooja nivedyams:", error);
    } finally {
      setLoading(false);
    }
  }, [pooja?.id]);

  useEffect(() => {
    if (pooja?.id) {
      fetchNivedyamsAndPoojaData();
    }
  }, [pooja, fetchNivedyamsAndPoojaData]);

  const handleAddNivedyam = () => {
    setPoojaNivedyams((prev) => [
      ...prev,
      { nivedyam_id: "", quantity: "1", price: 0, units: "PCS", isExisting: false },
    ]);
  };

  const handleChange = (index, field, value) => {
    setPoojaNivedyams((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          if (field === "quantity") {
            const unitPrice = item.default_price || 0;
            const parsedQty = parseFloat(value) || 0;
            return {
              ...item,
              [field]: value,
              price: (parsedQty * unitPrice).toFixed(2),
            };
          }
          return { ...item, [field]: value };
        } else {
          return item;
        }
      })
    );
  };

  const handleNivedyamSelect = (index, selectedId) => {
    const isAlreadyAdded = poojaNivedyams.find(
      (item) => item.nivedyam_id === parseInt(selectedId)
    );
    if (isAlreadyAdded) {
      alert("Nivedyam already added! Please edit the existing entry or select another product.");
      return;
    }
    const selectedNivedyam = nivedyamsList.find(
      (item) => item.id === parseInt(selectedId)
    );
    if (!selectedNivedyam) return;

    setPoojaNivedyams((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          // Calculate unit price from catalog price
          const unitPrice = selectedNivedyam.price || 0;
          return {
            ...item,
            nivedyam_id: selectedNivedyam.id,
            price: selectedNivedyam.price,
            quantity: "1",
            units: selectedNivedyam.unit || "PCS",
            default_price: unitPrice,
          };
        }
        return item;
      })
    );
  };

  const handleDeleteNivedyam = async (index, item) => {
    if (item.isExisting && item.id) {
      const confirmDelete = window.confirm(
        "Are you sure you want to remove this Nivedyam linkage?"
      );
      if (!confirmDelete) return;

      try {
        setSaving(true);
        await deletePoojaNivedyam(item.id);
        setPoojaNivedyams((prev) => prev.filter((_, i) => i !== index));
      } catch (error) {
        console.error("Error removing pooja nivedyam mapping:", error);
      } finally {
        setSaving(false);
      }
    } else {
      setPoojaNivedyams((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = async (item) => {
    try {
      setSaving(true);
      await addPoojaNivedyam({
        pooja_id: pooja.id,
        nivedyam_id: item.nivedyam_id,
        quantity: String(item.quantity),
        price: parseFloat(item.price) || 0,
        units: item.units || "PCS",
      });
      alert("Nivedyam linkage saved successfully!");
      fetchNivedyamsAndPoojaData();
    } catch (error) {
      console.error("Error saving pooja nivedyam linkage:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative overflow-y-scroll max-h-[400px]">
      {saving && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="hidden sm:grid grid-cols-12 gap-4 items-center border p-2 rounded-lg shadow-sm bg-gray-100 font-bold text-sm">
        <label className="col-span-4">Nivedyam Item</label>
        <label className="col-span-2">Quantity</label>
        <label className="col-span-2">Units</label>
        <label className="col-span-2">Price</label>
        <label className="col-span-2 text-center">Actions</label>
      </div>

      {poojaNivedyams.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center border p-4 sm:p-2 rounded-lg shadow-sm mt-2"
        >
          <span className="sm:hidden font-bold">Nivedyam:</span>
          <div className="col-span-1 sm:col-span-4">
            <select
              className="border p-2 rounded w-full bg-white"
              value={item.nivedyam_id || ""}
              onChange={(e) => handleNivedyamSelect(index, e.target.value)}
              disabled={item.isExisting}
            >
              <option value="">Select Nivedyam</option>
              {nivedyamsList.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.name}
                </option>
              ))}
            </select>
          </div>

          <span className="sm:hidden font-bold">Quantity:</span>
          <div className="col-span-1 sm:col-span-2">
            <input
              type="text"
              placeholder="Qty"
              className="border p-2 rounded w-full bg-white"
              value={item.quantity}
              onChange={(e) => handleChange(index, "quantity", e.target.value)}
              disabled={item.isExisting}
            />
          </div>

          <span className="sm:hidden font-bold">Units:</span>
          <div className="col-span-1 sm:col-span-2">
            <input
              type="text"
              placeholder="Units"
              className="border p-2 rounded w-full bg-gray-50"
              value={item.units}
              disabled
            />
          </div>

          <span className="sm:hidden font-bold">Price:</span>
          <div className="col-span-1 sm:col-span-2">
            <input
              type="number"
              placeholder="Price"
              className="border p-2 rounded w-full bg-gray-50"
              value={item.price}
              disabled
            />
          </div>

          <div className="col-span-1 sm:col-span-2 flex justify-center mt-2 sm:mt-0">
            {item.isExisting ? (
              <button
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded w-full sm:w-auto text-sm font-semibold"
                onClick={() => handleDeleteNivedyam(index, item)}
              >
                Delete
              </button>
            ) : (
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full sm:w-auto text-sm font-semibold"
                onClick={() => handleSave(item)}
              >
                Save
              </button>
            )}
          </div>
        </div>
      ))}

      {poojaNivedyams.length === 0 && (
        <p className="text-center py-6 text-gray-500 text-sm">
          No Nivedyams linked to this Pooja yet.
        </p>
      )}

      <div className="flex justify-between items-center mt-4 sticky bottom-0 left-0 bg-white pt-3 border-t">
        <div className="flex gap-2">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded font-semibold text-sm"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold text-sm"
            onClick={handleAddNivedyam}
          >
            + Link Nivedyam
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoojaNivedyamsForm;
