import React, { useState, useEffect } from "react";

const PoojaItemsModal = ({ isOpen, onClose, onConfirm, items, initialSelectedItems }) => {
    const [localSelectedItems, setLocalSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLocalSelectedItems(initialSelectedItems || []);
            // Check if all items are selected initially
            if (items.length > 0 && initialSelectedItems?.length === items.length) {
                setSelectAll(true);
            } else {
                setSelectAll(false);
            }
        }
    }, [isOpen, initialSelectedItems, items]);

    const handleToggleItem = (item) => {
        setLocalSelectedItems((prev) => {
            const exists = prev.some((i) => i.name === item.name);
            const updated = exists
                ? prev.filter((i) => i.name !== item.name)
                : [...prev, item];

            setSelectAll(updated.length === items.length);
            return updated;
        });
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setLocalSelectedItems([]);
            setSelectAll(false);
        } else {
            setLocalSelectedItems([...items]);
            setSelectAll(true);
        }
    };

    const handleConfirm = () => {
        onConfirm(localSelectedItems);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-orange-50">
                    <div>
                        <h2 className="text-2xl font-bold text-orange-800">Select Pooja Items</h2>
                        <p className="text-sm text-gray-600 mt-1">Customize your pooja by adding necessary items</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none p-2 rounded-full hover:bg-orange-100 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
                    {/* Select All and Clear Selection */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-dashed border-gray-200">
                        <label className="flex items-center cursor-pointer group select-none">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                    className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded md:rounded-md checked:bg-orange-600 checked:border-orange-600 transition-all"
                                />
                                <svg
                                    className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="ml-3 text-lg font-semibold text-gray-800 group-hover:text-orange-700 transition-colors">
                                Select All Items
                            </span>
                        </label>

                        {localSelectedItems.length > 0 && (
                            <button
                                onClick={() => {
                                    setLocalSelectedItems([]);
                                    setSelectAll(false);
                                }}
                                className="text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors border border-red-200"
                            >
                                Unselect All
                            </button>
                        )}
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item, idx) => {
                            const isSelected = localSelectedItems.some((i) => i.name === item.name);
                            return (
                                <div
                                    key={idx}
                                    className={`relative flex items-center p-3 border rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer ${isSelected
                                        ? "border-orange-500 bg-orange-50 shadow-sm"
                                        : "border-gray-200 bg-white"
                                        }`}
                                    onClick={() => handleToggleItem(item)}
                                >
                                    {/* Checkbox (Visual) */}
                                    <div className="absolute top-3 right-3">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? "bg-orange-600 border-orange-600" : "border-gray-300 bg-white"
                                            }`}>
                                            {isSelected && (
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>

                                    {/* Image */}
                                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="ml-4 flex-1 pr-6">
                                        <h4 className="font-semibold text-gray-900 line-clamp-1" title={item.name}>{item.name}</h4>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {item.quantity} {item.units}
                                        </p>
                                        <p className="text-orange-700 font-bold mt-1">
                                            ₹{item.price}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {items.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No items available for this Pooja.
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition-colors border border-gray-300 bg-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-8 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-lg shadow-orange-200 transition-all transform active:scale-95"
                    >
                        Add Selected Items ({localSelectedItems.length})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PoojaItemsModal;
