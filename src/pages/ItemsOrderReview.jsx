import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import apiClient from "../utils/appClient";

const ItemsOrderReview = () => {
  const { orderData, address, setAddress } = useAppContext();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTodayTime = () => {
    const today = new Date();
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const seconds = String(today.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  // Load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Payment handler
  const handleConfirm = async () => {
    if (!address || !phoneNumber) {
      alert("Please fill all the details before proceeding.");
      return;
    }

    if (phoneNumber.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Please check your internet connection.");
      setLoading(false);
      return;
    }

    try {
      const orderResponse = await apiClient.post("payment/create-order", {
        amount: orderData.totalPrice,
        currency: "INR",
      });

      const { orderId, amount, currency, key } = orderResponse.data;

      const options = {
        key,
        amount: amount.toString(),
        currency,
        name: "Agraharam",
        description: "Standalone purchase of pooja items.",
        order_id: orderId,
        prefill: {
          name: user?.user?.name || user?.name || "",
          email: user?.user?.email || user?.email || "",
          contact: phoneNumber || user?.user?.phone || user?.phone || "",
        },
        theme: {
          color: "#f97316",
        },
        handler: async function (response) {
          try {
            const serializedAddress = JSON.stringify({
              isStandaloneItems: true,
              deliveryAddress: address,
              items: orderData.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                description: item.description || "Ritual samagri"
              }))
            });

            const verifyRes = await apiClient.post(
              `/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                user_id: user ? user.user.id : "",
                pooja_id: null, // Omitted pooja_id for standalone item purchase
                total_amount: amount,
                booking_date: getTodayDate(),
                booking_time: getTodayTime(),
                address: serializedAddress,
                phone_number: phoneNumber,
              }
            );

            if (verifyRes.data.success) {
              alert("🎉 Item purchase successful!");
              navigate("/orders");
            } else {
              alert("❌ Payment verification failed!");
            }
          } catch (err) {
            console.error("❌ Payment verification error:", err);
            alert("Payment verification failed!");
          } finally {
            setLoading(false);
          }
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("❌ Payment error:", err);
      alert("Payment initialization failed. Please try again later.");
      setLoading(false);
    }
  };

  if (!orderData) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        No cart data found. Please go back and select items.
      </div>
    );
  }


  return (
    <div className="relative min-h-screen bg-[#fffaf0] p-6">
      {/* Spinner Overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white mt-3 text-lg font-medium">Processing your order...</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6 border border-orange-100">
        <h2 className="text-2xl font-bold text-orange-800 mb-6">Review Item Purchase</h2>

        {/* Selected Items */}
        <div className="mb-6 bg-orange-50 rounded-xl p-4 border border-orange-100">
          <h3 className="font-semibold text-orange-950 mb-3">Cart Summary</h3>
          <ul className="divide-y divide-orange-100">
            {orderData.items?.map((item, index) => (
              <li key={index} className="py-2.5 flex justify-between text-gray-800 text-sm">
                <span>
                  {item.name} <span className="text-gray-500 text-xs">({item.quantity} {item.units || "items"})</span>
                </span>
                <span className="font-semibold text-orange-900">₹{item.price}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing Summary */}
        <div className="mb-6 border-b border-orange-100 pb-4">
          <div className="flex justify-between items-center text-gray-700 mb-1.5 text-sm">
            <span>Items Cost</span>
            <span>₹{orderData.itemCost}</span>
          </div>
          <div className="flex justify-between items-center text-gray-900 text-lg font-bold">
            <span>Total Price</span>
            <span className="text-orange-700">₹{orderData.totalPrice}</span>
          </div>
        </div>

        {/* Address */}
        <div className="mb-5">
          <label className="block mb-1.5 font-semibold text-gray-700 text-sm">Delivery Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800 text-sm"
            placeholder="Enter full delivery address"
          />
        </div>

        {/* Phone Number */}
        <div className="mb-5">
          <label className="block mb-1.5 font-semibold text-gray-700 text-sm">Contact Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) setPhoneNumber(value);
            }}
            onKeyDown={(e) => {
              if (
                !/[0-9]/.test(e.key) &&
                e.key !== "Backspace" &&
                e.key !== "Delete" &&
                e.key !== "ArrowLeft" &&
                e.key !== "ArrowRight" &&
                e.key !== "Tab"
              ) {
                e.preventDefault();
              }
            }}
            className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800 text-sm"
            placeholder="Enter your 10-digit phone number"
            inputMode="numeric"
            required
          />
          {phoneNumber && phoneNumber.length !== 10 && (
            <p className="text-xs text-red-600 mt-1.5 font-medium">
              Please enter a valid 10-digit number
            </p>
          )}
        </div>

        <div className="mb-6"></div>

        <button
          onClick={handleConfirm}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl shadow-md transition active:scale-95 text-base"
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm & Proceed to Payment"}
        </button>
      </div>
    </div>
  );
};

export default ItemsOrderReview;
