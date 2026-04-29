import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import apiClient from "../utils/appClient";
import axios from "axios";

const OrderReviewPage = () => {
  const { orderData, address, setAddress } = useAppContext();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [poojaDate, setPoojaDate] = useState("");
  const [poojaTime, setPoojaTime] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Spinner state

  // ✅ Load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ✅ Payment handler
  const handleConfirm = async () => {
    if (!address || !poojaDate || !poojaTime || !phoneNumber) {
      alert("Please fill all the details before proceeding.");
      return;
    }

    setLoading(true); // 🔥 Show spinner when API starts

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Please check your internet.");
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
        name: "Pooja Booking App",
        description: `Booking for ${orderData.poojaName}`,
        order_id: orderId,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: phoneNumber || user?.phone || "",
        },
        theme: {
          color: "#f97316",
        },
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${process.env.REACT_APP_BASE_URL}/api/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                user_id: user ? user.user.id : "",
                pooja_id: orderData.poojaId,
                total_amount: amount,
                booking_date: poojaDate,
                booking_time: poojaTime,
                address,
                phone_number: phoneNumber,
              }
            );

            if (verifyRes.data.success) {
              alert("🎉 Payment successful!");
              navigate("/orders");
            } else {
              alert("❌ Payment verification failed!");
            }
          } catch (err) {
            console.error("❌ Payment verification error:", err);
            alert("Payment verification failed!");
          } finally {
            setLoading(false); // 🔥 Hide spinner after success/failure
          }
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("❌ Payment error:", err);
      alert("Payment initialization failed. Please try again later.");
      setLoading(false); // 🔥 Hide spinner if failed
    }
  };

  if (!orderData) {
    return (
      <div className="text-center mt-10 text-red-600">
        No order data found. Please go back and select a pooja.
      </div>
    );
  }

  const getMinDate = () => {
    // 1. Get today's date
    const today = new Date();

    // 2. Add two days (2 days * 24 hours/day * 60 min/hour * 60 sec/min * 1000 ms/sec)
    //    We use setDate to reliably add days across month boundaries.
    today.setDate(today.getDate() + 2);

    // 3. Format the date as 'YYYY-MM-DD' required by the input min attribute
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  return (
    <div className="relative min-h-screen bg-[#fffaf0] p-6">
      {/* ✅ Spinner Overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white mt-3 text-lg font-medium">Processing your order...</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-orange-700 mb-4">Review Your Order</h2>

        {/* Order details */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-1">{orderData.poojaName}</h3>
          <p className="text-gray-700">{orderData.description}</p>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold text-orange-700 mb-2">Selected Items:</h4>
          <ul className="list-disc ml-5 text-gray-800">
            {orderData.items?.map((item, index) => (
              <li key={index}>
                {item.name} ({item.quantity}) – ₹{item.price}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <p className="text-lg font-medium">Item Total: ₹{orderData.itemCost}</p>
          <p className="text-lg font-medium">Pooja Price: ₹{parseFloat(orderData.price)}</p>
          <p className="text-lg font-bold">Total Price: ₹{orderData.totalPrice}</p>
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Delivery Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="w-full border rounded-md p-2"
            placeholder="Enter full address"
          />
        </div>

        {/* ✅ Phone Number */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Phone Number</label>
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
            className="w-full border rounded-md p-2"
            placeholder="Enter your 10-digit phone number"
            inputMode="numeric"
            required
          />
          {phoneNumber && phoneNumber.length !== 10 && (
            <p className="text-sm text-red-600 mt-1">
              Please enter a valid 10-digit number
            </p>
          )}
        </div>

        {/* Date & Time */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-700">Pooja Date </label>
            {/* <input
              type="date"
              value={poojaDate}
              onChange={(e) => setPoojaDate(e.target.value)}
              className="w-full border rounded-md p-2"
            /> */}
            <input
              id="pooja-date"
              type="date"
              value={poojaDate}
              onChange={(e) => setPoojaDate(e.target.value)}
              className="w-full border rounded-md p-2"
              // --- KEY FIX: Set the minimum date dynamically ---
              min={getMinDate()}
            />
            <p className="mt-2 text-sm text-green-600">(Must be selected after two days from today)</p>

          </div>

          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-700">Pooja Time</label>
            <input
              type="time"
              value={poojaTime}
              onChange={(e) => setPoojaTime(e.target.value)}
              className="w-full border rounded-md p-2"
              min={getMinDate()}
            />
          </div>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-md"
          disabled={loading} // disable button while loading
        >
          {loading ? "Processing..." : "Confirm & Proceed to Payment"}
        </button>
      </div>
    </div>
  );
};

export default OrderReviewPage;


