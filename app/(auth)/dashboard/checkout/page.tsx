"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  // ------------------ STATE ------------------
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("Morning");

  const [paymentMethod, setPaymentMethod] = useState("esewa");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // ------------------ CALCULATIONS ------------------
  const subtotal = cart.reduce(
    (sum, item) =>
      sum + (item.discountedPrice || item.price) * (item.quantity || 1),
    0
  );

  const deliveryCharge = 500;
  const total = subtotal + deliveryCharge;

  // ------------------ PAYMENT HANDLER ------------------
  const handlePayment = async () => {
    if (!name || !phone || !location) {
      alert("Please fill all shipping details!");
      return;
    }

    if (phone.length !== 10) {
      alert("Phone number must be 10 digits!");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setProcessing(true);

    try {
      // Fake payment delay (Demo purpose)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newOrderNumber = `ORD-${Date.now()}`;

      const order = {
        _id: Date.now().toString(),
        orderNumber: newOrderNumber,
        date: new Date().toLocaleDateString(),
        total,
        status: "Confirmed",
        paymentMethod,
        customerName: name,
        customerPhone: phone,
        deliveryAddress: location,
        deliveryTime,
        items: cart,
      };

      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      localStorage.setItem("orders", JSON.stringify([order, ...existingOrders]));

      setOrderNumber(newOrderNumber);
      setSuccess(true);
      clearCart();

      setTimeout(() => {
        router.push("/dashboard/orders");
      }, 2500);
    } catch (error) {
      console.log(error);
      alert("Payment Failed!");
    } finally {
      setProcessing(false);
    }
  };

  // ------------------ EMPTY CART ------------------
  if (cart.length === 0 && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-10 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
          <button
            onClick={() => router.push("/dashboard/catalog")}
            className="bg-pink-500 text-white px-6 py-3 rounded-lg"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  // ------------------ UI ------------------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-xl max-w-xl mx-auto mb-6">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>Rs {subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>Rs {deliveryCharge}</span>
        </div>
        <hr className="my-3" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-pink-500">Rs {total}</span>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="bg-white p-6 rounded-xl max-w-xl mx-auto mb-6 space-y-3">
        <h2 className="text-xl font-bold">Shipping Information</h2>

        <input
          placeholder="Full Name"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex gap-2">
          <input
            value="+977"
            readOnly
            className="w-20 border p-2 rounded bg-gray-100"
          />
          <input
            placeholder="98XXXXXXXX"
            className="flex-1 border p-2 rounded"
            value={phone}
            maxLength={10}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <input
          placeholder="Delivery Address"
          className="w-full border p-2 rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <select
          className="w-full border p-2 rounded"
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(e.target.value)}
        >
          <option>Morning (8AM - 12PM)</option>
          <option>Afternoon (12PM - 4PM)</option>
          <option>Evening (4PM - 8PM)</option>
        </select>
      </div>

      {/* Payment */}
      <div className="bg-white p-6 rounded-xl max-w-xl mx-auto space-y-4">
        <h2 className="text-xl font-bold">Payment Method</h2>

        <label className="flex gap-2">
          <input
            type="radio"
            value="esewa"
            checked={paymentMethod === "esewa"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          eSewa
        </label>

        <label className="flex gap-2">
          <input
            type="radio"
            value="khalti"
            checked={paymentMethod === "khalti"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Khalti
        </label>

        <button
          onClick={handlePayment}
          disabled={processing || success}
          className="w-full bg-pink-500 text-white py-3 rounded-lg"
        >
          {processing ? "Processing..." : `Pay Rs ${total}`}
        </button>

        {success && (
          <div className="bg-green-100 p-3 rounded text-center">
            Payment Successful! <br />
            Order ID: <b>{orderNumber}</b>
          </div>
        )}
      </div>
    </div>
  );
}
