import React, { useState, useEffect } from "react";
import uploadToCloudinary from "../../../utils/cloudinaryUpload";

const ItemForm = ({ onSubmit, onClose, existingItem }) => {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [default_quantity, setDefaultQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [units, setUnits] = useState("");
  const [image, setImage] = useState("");


  useEffect(() => {
    if (existingItem) {
      setItemName(existingItem.name);
      setDescription(existingItem.description);
      setDefaultQuantity(existingItem.default_quantity);
      setPrice(existingItem.price);
      setUnits(existingItem.units);
      setImage(existingItem.image)

    } else {
      setItemName("");
      setDescription("");
      setDefaultQuantity(1);
      setPrice(0)
      setUnits("");
      setImage("");
    }
  }, [existingItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ item_name: itemName, description, default_quantity, price, units, image });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    // setImageFile(file);

    if (!file) return;

    try {
      const uploadedUrl = await uploadToCloudinary(file);
      setImage(uploadedUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed. Please try again.");
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-center mb-2">
        {existingItem ? "Edit Item" : "Create Item"}
      </h2>
      <div>
        <label className="block font-medium mb-1">Item Name</label>
        <input
          type="text"
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
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
        <label className="block font-medium mb-1">Quantity</label>
        <input
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500"
          value={default_quantity}
          onChange={(e) => setDefaultQuantity(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Price</label>
        <input
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Units</label>
        <select
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500"
          value={units}
          onChange={(e) => setUnits(e.target.value)}
          required
        >
          <option value="">Select Unit</option>
          <option value="PCS">PCS</option>
          <option value="GMS">GMS</option>
          <option value="ML">ML</option>
        </select>
      </div>
      <div>
        <label className="block font-medium md-1">Upload Item Image</label>
        <input
          type="file"
          accept="image/*"
          className="w-full border riunded-lg p-2"
          onChange={handleImageChange}
        />
        {image && (
          <div className="flex justify-center mt-2">
            <img
              src={image}
              alt="preview"
              className="w-32 h-32 mt-2 rounded border object-cover"
            />
          </div>
        )

        }
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
          {existingItem ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default ItemForm;
