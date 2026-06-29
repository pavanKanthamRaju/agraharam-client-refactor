import React, { useState, useEffect } from "react";
import Modal from "./components/Modal";
import NivedyamForm from "./components/NivedyamForm";
import * as XLSX from "xlsx";
import { FiDownload } from "react-icons/fi";
import {
  getAllNivedyams,
  createNivedyam,
  updateNivedyam,
  deleteNivedyam,
} from "../../api/dashboardsApi";

const NivedyamPage = () => {
  const [nivedyams, setNivedyams] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredNivedyams, setFilteredNivedyams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNivedyam, setSelectedNivedyam] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNivedyams = async () => {
    try {
      setLoading(true);
      const res = await getAllNivedyams();
      // Sort alphabetically by name
      const dataArray = Array.isArray(res) ? res : (res.nivedyams || res.nivedyam || []);
      const sortedData = [...dataArray].sort((a, b) =>
        a.name?.localeCompare(b.name)
      );
      setNivedyams(sortedData);
      setFilteredNivedyams(sortedData);
    } catch (error) {
      console.error("Error fetching Nivedyams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNivedyams();
  }, []);

  useEffect(() => {
    const searchString = search.toLowerCase();
    const filtered = nivedyams.filter((nivedyam) =>
      nivedyam.name?.toLowerCase().includes(searchString)
    );
    const sorted = [...filtered].sort((a, b) =>
      a.name?.localeCompare(b.name)
    );
    setFilteredNivedyams(sorted);
  }, [nivedyams, search]);

  const handleSubmit = async (nivedyamData) => {
    try {
      setLoading(true);
      const res = selectedNivedyam
        ? await updateNivedyam(selectedNivedyam.id, nivedyamData)
        : await createNivedyam(nivedyamData);

      if (res.success || res) {
        await fetchNivedyams();
        setIsModalOpen(false);
        setSelectedNivedyam(null);
      }
    } catch (error) {
      alert(error.message);
      console.error("Error saving Nivedyam:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Nivedyam product?")) return;
    try {
      setLoading(true);
      const res = await deleteNivedyam(id);
      if (res.success || res) await fetchNivedyams();
    } catch (error) {
      console.error("Error deleting Nivedyam:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    if (!nivedyams?.length) return;
    const dataForExcel = nivedyams.map((item) => ({
      Name: item.name,
      Price: item.price,
      Description: item.description,
      Unit: item.unit,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Nivedyams");
    XLSX.writeFile(workbook, "nivedyams.xlsx");
  };

  return (
    <div className="relative p-4 sm:p-6 bg-gray-100 min-h-screen">
      {/* Spinner Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
          Manage Nivedyams
        </h1>
        <div className="flex gap-3">
          <button
            className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md active:scale-95 transition"
            onClick={handleDownloadExcel}
          >
            <FiDownload className="w-4 h-4 inline mr-1" />
            Download as Excel
          </button>

          <button
            onClick={() => {
              setSelectedNivedyam(null);
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md active:scale-95 transition"
          >
            + Create Nivedyam
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
        <input
          type="text"
          placeholder="Search by Nivedyam name..."
          className="w-full sm:w-1/3 p-2 border rounded bg-white shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNivedyams.map((item) => (
          <div
            key={item.id}
            className="flex flex-col h-full bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-100"
          >
            {/* Card Header */}
            <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-orange-300 to-orange-400 border-b">
              <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
              {item.price && (
                <span className="text-blue-700 font-semibold">
                  ₹{item.price} / {item.unit}
                </span>
              )}
            </div>

            {/* Card Body */}
            <div className="p-4 flex-grow flex flex-col justify-between">
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {item.description || "No description provided."}
              </p>
              {item.image_url && (
                <div className="h-32 w-full overflow-hidden rounded-lg mb-2 border border-gray-100">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-700">
              <button
                onClick={() => {
                  setSelectedNivedyam(item);
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
      {filteredNivedyams.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-8">
          No Nivedyams available. Click “Create Nivedyam” to add one.
        </p>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NivedyamForm
          existingNivedyam={selectedNivedyam}
          onSubmit={handleSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default NivedyamPage;
