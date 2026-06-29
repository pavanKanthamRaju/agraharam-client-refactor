import React, { useState, useEffect } from "react";
import uploadToCloudinary from "../../../utils/cloudinaryUpload";

const NivedyamForm = ({ onSubmit, onClose, existingNivedyam }) => {
  const [nivedyamName, setNivedyamName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (existingNivedyam) {
      setNivedyamName(existingNivedyam.name || "");
      setDescription(existingNivedyam.description || "");
      setCategoryId(existingNivedyam.category_id || 1);
      setPrice(existingNivedyam.price || "");
      setUnit(existingNivedyam.unit || "");
      setImageUrl(existingNivedyam.image_url || "");
    } else {
      setNivedyamName("");
      setDescription("");
      setCategoryId(1);
      setPrice("");
      setUnit("");
      setImageUrl("");
    }
  }, [existingNivedyam]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      nivedyam_name: nivedyamName,
      description,
      category_id: parseInt(categoryId) || 1,
      price: parseFloat(price) || 0,
      unit,
      image_url: imageUrl,
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploadedUrl = await uploadToCloudinary(file);
      setImageUrl(uploadedUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-center mb-2">
        {existingNivedyam ? "Edit Nivedyam" : "Create Nivedyam"}
      </h2>
      <div>
        <label className="block font-medium mb-1">Nivedyam Name</label>
        <input
          type="text"
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500"
          value={nivedyamName}
          onChange={(e) => setNivedyamName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Category ID</label>
        <input
          type="number"
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Price</label>
        <input
          type="text"
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Unit</label>
        <select
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          required
        >
          <option value="">Select Unit</option>
          <option value="PCS">PCS</option>
          <option value="GMS">GMS</option>
          <option value="ML">ML</option>
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1">Upload Nivedyam Image</label>
        <input
          type="file"
          accept="image/*"
          className="w-full border rounded-lg p-2"
          onChange={handleImageChange}
        />
        {imageUrl && (
          <div className="flex justify-center mt-2">
            <img
              src={imageUrl}
              alt="preview"
              className="w-32 h-32 mt-2 rounded border object-cover"
            />
          </div>
        )}
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700"
        >
          {existingNivedyam ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default NivedyamForm;
