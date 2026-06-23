import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllItems } from "../api/dashboardsApi";
import { useAuth } from "../context/authContext";
import { useAppContext } from "../context/appContext";
import { FiShoppingBag, FiSearch, FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";

const Spinner = () => (
  <div className="flex justify-center items-center h-[60vh] bg-transparent">
    <motion.div
      className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1 }}
    />
  </div>
);

const BuyItemsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setOrderData } = useAppContext();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState({});
  const [cardQuantities, setCardQuantities] = useState({});

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const res = await getAllItems();
        // Sort items alphabetically
        const sortedItems = (res.items || []).sort((a, b) =>
          a.name?.localeCompare(b.name)
        );
        setItems(sortedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const addToCart = (item, qtyToAdd = 1) => {
    setCart((prevCart) => {
      const currentQty = prevCart[item.id]?.quantity || 0;
      return {
        ...prevCart,
        [item.id]: {
          ...item,
          quantity: currentQty + qtyToAdd,
        },
      };
    });
  };

  const handleAddWithQuantity = (item) => {
    const qtyToAdd = cardQuantities[item.id] || 1;
    addToCart(item, qtyToAdd);
    setCardQuantities((prev) => ({
      ...prev,
      [item.id]: 1,
    }));
  };

  const updateQuantity = (itemId, change) => {
    setCart((prevCart) => {
      const item = prevCart[itemId];
      if (!item) return prevCart;

      const newQty = item.quantity + change;
      if (newQty <= 0) {
        const newCart = { ...prevCart };
        delete newCart[itemId];
        return newCart;
      }

      return {
        ...prevCart,
        [itemId]: {
          ...item,
          quantity: newQty,
        },
      };
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[itemId];
      return newCart;
    });
  };

  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartArray = Object.values(cart);
  const cartTotal = cartArray.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const totalItemCount = cartArray.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cartArray.length === 0) return;

    if (!user) {
      // Direct back to checkout after login
      navigate("/login");
      return;
    }

    const checkoutData = {
      poojaId: null,
      poojaName: "Pooja Items Purchase",
      description: "Standalone purchase of selected pooja items.",
      price: 0,
      itemCost: cartTotal,
      totalPrice: cartTotal,
      items: cartArray.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: Number(item.price) * item.quantity,
        quantity: item.quantity,
        units: item.units,
      })),
    };

    setOrderData(checkoutData);
    localStorage.setItem("orderData", JSON.stringify(checkoutData));
    navigate("/items-order-review");
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-[#fffaf0] py-6 px-4 md:px-8">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <FiShoppingBag size={200} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Buy Pooja Items</h1>
        <p className="text-sm md:text-base text-orange-50 max-w-xl">
          Purchase premium pooja items, offerings, and samagri independently. Hand-selected for your holy ceremonies.
        </p>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side: Items Catalog */}
        <div className="flex-1 w-full">
          {/* Search Bar */}
          <div className="mb-6 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-600 text-lg" />
            <input
              type="text"
              placeholder="Search items by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-orange-200 rounded-xl pl-12 pr-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-orange-100 shadow-sm">
              <p className="text-gray-500 text-lg">No items match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-orange-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full group"
                  >
                    {/* Item Image */}
                    <div className="h-48 w-full bg-orange-50 relative overflow-hidden border-b border-orange-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300?text=" + encodeURIComponent(item.name);
                        }}
                      />
                      {item.units && (
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-orange-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-orange-200 shadow-sm">
                          Pack of {item.default_quantity || 1} {item.units}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
                        {item.description || "Premium ritual samagri for your home pooja."}
                      </p>

                      <div className="mt-auto flex flex-col gap-3 pt-2 border-t border-orange-50">
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-black text-orange-700">
                            ₹{Number(item.price).toLocaleString()}
                          </span>

                          <div className="flex items-center bg-orange-50 rounded-xl border border-orange-200 px-1 py-0.5">
                            <button
                              onClick={() => {
                                const current = cardQuantities[item.id] || 1;
                                if (current > 1) {
                                  setCardQuantities((prev) => ({
                                    ...prev,
                                    [item.id]: current - 1,
                                  }));
                                }
                              }}
                              className="text-orange-700 hover:bg-orange-100 p-2 rounded-lg transition"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="font-semibold text-orange-950 px-3 min-w-[24px] text-center">
                              {cardQuantities[item.id] || 1}
                            </span>
                            <button
                              onClick={() => {
                                const current = cardQuantities[item.id] || 1;
                                setCardQuantities((prev) => ({
                                  ...prev,
                                  [item.id]: current + 1,
                                }));
                              }}
                              className="text-orange-700 hover:bg-orange-100 p-2 rounded-lg transition"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddWithQuantity(item)}
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition shadow-sm active:scale-95 flex items-center justify-center gap-2"
                        >
                          <FiShoppingBag size={16} />
                          {cart[item.id] ? `Add More (${cardQuantities[item.id] || 1})` : `Add to Cart (${cardQuantities[item.id] || 1})`}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Cart Summary Panel */}
        <div className="w-full lg:w-96 bg-white rounded-2xl border border-orange-100 shadow-md p-6 sticky top-28">
          <div className="flex items-center justify-between pb-4 border-b border-orange-100 mb-4">
            <h2 className="text-xl font-bold text-orange-900 flex items-center gap-2">
              <FiShoppingBag className="text-orange-600" /> Shopping Cart
            </h2>
            <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-orange-200">
              {totalItemCount} {totalItemCount === 1 ? "item" : "items"}
            </span>
          </div>

          {cartArray.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm mb-2">Your cart is empty.</p>
              <p className="text-xs text-gray-500">Choose from our catalog to get started.</p>
            </div>
          ) : (
            <>
              {/* Cart List */}
              <div className="max-h-[350px] overflow-y-auto pr-1 mb-4 divide-y divide-orange-50 scrollbar-thin">
                {cartArray.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        ₹{Number(item.price)} × {item.quantity}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-orange-50 rounded-lg border border-orange-200 px-1 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-orange-700 hover:bg-orange-100 p-1 rounded transition"
                        >
                          <FiMinus size={10} />
                        </button>
                        <span className="font-semibold text-orange-950 px-2 min-w-[16px] text-center text-xs">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-orange-700 hover:bg-orange-100 p-1 rounded transition"
                        >
                          <FiPlus size={10} />
                        </button>
                      </div>
                      <span className="font-bold text-sm text-orange-700 min-w-[60px] text-right">
                        ₹{(Number(item.price) * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="border-t border-orange-100 pt-4 mb-6">
                <div className="flex justify-between items-center text-gray-700 mb-1">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-semibold">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-700 mb-3">
                  <span className="text-sm">Delivery charges</span>
                  <span className="text-xs text-green-600 font-semibold uppercase">Free</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-dashed border-orange-100">
                  <span className="font-bold text-gray-900">Total Price</span>
                  <span className="text-xl font-extrabold text-orange-800">
                    ₹{cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyItemsPage;
