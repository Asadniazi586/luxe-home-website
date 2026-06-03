import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { orderService } from "../services/orderService";
import toast from "react-hot-toast";
import {
  FiChevronDown,
  FiCheck,
  FiCreditCard,
  FiHome,
  FiLock,
  FiUser,
  FiAlertCircle,
  FiX,
  FiSend,
  FiTrash2,
} from "react-icons/fi";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");
  const [saveInfo, setSaveInfo] = useState(false);
  const [textOffers, setTextOffers] = useState(false);
  const [billingOption, setBillingOption] = useState("same");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState("");

  // Hardcoded discount codes
  const discountCodes = {
    "SAVE10": { type: "percentage", value: 10, description: "10% off" },
    "SAVE20": { type: "fixed", value: 20, description: "$20 off" },
    "WELCOME15": { type: "percentage", value: 15, description: "15% off" },
    "FIRSTORDER": { type: "fixed", value: 25, description: "$25 off" },
  };

  // Redirect admin to shop
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/shop');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "PK",
    phone: "",
    croCode: "",
  });

  // Billing address form (if different)
  const [billingData, setBillingData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "PK",
    phone: "",
  });

  // Pakistan Provinces
  const pakistanProvinces = [
    "Sindh",
    "Punjab",
    "Islamabad Capital Territory",
    "Khyber Pakhtunkhwa",
    "Balochistan",
    "Gilgit-Baltistan",
  ];

  // Payment Methods
  const paymentMethods = [
    {
      id: "cod",
      name: "Cash On Delivery",
      icon: "💰",
      description: "Pay when you receive your order",
    },
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      icon: "🏦",
      description: "Manual bank transfer",
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBillingChange = (e) => {
    setBillingData({ ...billingData, [e.target.name]: e.target.value });
  };

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      setDiscountError("Please enter a discount code");
      toast.error("Please enter a discount code");
      return;
    }

    const discount = discountCodes[discountCode.toUpperCase()];
    if (discount) {
      setAppliedDiscount(discount);
      setDiscountError("");
      setDiscountCode("");
      toast.success(`Discount applied! ${discount.description}`);
    } else {
      setDiscountError("Invalid discount code");
      toast.error("Invalid discount code");
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountError("");
    toast.success("Discount removed");
  };

  const calculateDiscountedTotal = () => {
    let total = totalPrice + shippingPrice;
    if (appliedDiscount) {
      if (appliedDiscount.type === "percentage") {
        total = total - (total * appliedDiscount.value / 100);
      } else if (appliedDiscount.type === "fixed") {
        total = total - appliedDiscount.value;
      }
    }
    return Math.max(0, total);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!user) {
      toast.error("Please sign in to complete your order", {
        duration: 4000,
        icon: "🔐",
      });
      setTimeout(() => {
        navigate("/login", { state: { from: "/checkout" } });
      }, 2000);
      return;
    }

    if (!formData.state) {
      toast.error("Please select a province");
      return;
    }

    setLoading(true);
    try {
      const orderItems = cartItems.map((item) => ({
        product: item.id || item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        size: item.selectedSize || "",
        color: item.selectedColor || "",
      }));

      const shippingPrice = 5.0;
      const discountedTotal = calculateDiscountedTotal();

      const orderData = {
        orderItems,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          postalCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
          email: formData.email,
        },
        billingAddress:
          billingOption === "different"
            ? {
                firstName: billingData.firstName,
                lastName: billingData.lastName,
                address: billingData.address,
                apartment: billingData.apartment,
                city: billingData.city,
                state: billingData.state,
                postalCode: billingData.zipCode,
                country: billingData.country,
                phone: billingData.phone,
              }
            : null,
        paymentMethod:
          selectedPaymentMethod === "cod"
            ? "Cash on Delivery"
            : "Bank Transfer",
        itemsPrice: totalPrice,
        shippingPrice,
        totalPrice: discountedTotal,
        discountApplied: appliedDiscount ? {
          code: appliedDiscount.code,
          type: appliedDiscount.type,
          value: appliedDiscount.value,
          description: appliedDiscount.description
        } : null,
      };

      const order = await orderService.createOrder(orderData);

      if (order && order._id) {
        const orderSuccessData = {
          orderId: order._id.slice(-8).toUpperCase(),
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          items: cartItems,
          subtotal: totalPrice,
          shippingCharge: shippingPrice,
          tax: 0,
          total: discountedTotal,
          discountApplied: appliedDiscount,
          paymentStatus:
            selectedPaymentMethod === "cod" ? "Pending" : "Awaiting Payment",
          paymentMethod:
            selectedPaymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer",
          shippingAddress: {
            name: `${formData.firstName} ${formData.lastName}`,
            address: formData.address,
            city: formData.city,
            postalCode: formData.zipCode,
            country: formData.country,
            phone: formData.phone,
            email: formData.email,
          },
          billingAddress:
            billingOption === "different"
              ? {
                  name: `${billingData.firstName} ${billingData.lastName}`,
                  address: billingData.address,
                  city: billingData.city,
                  postalCode: billingData.zipCode,
                  country: billingData.country,
                  phone: billingData.phone,
                }
              : {
                  name: `${formData.firstName} ${formData.lastName}`,
                  address: formData.address,
                  city: formData.city,
                  postalCode: formData.zipCode,
                  country: formData.country,
                  phone: formData.phone,
                  email: formData.email,
                },
        };

        localStorage.setItem(
          "orderSuccessData",
          JSON.stringify(orderSuccessData)
        );

        toast.success("Order placed successfully!");
        window.location.href = "/order-success";
      } else {
        toast.error("Failed to create order");
        setLoading(false);
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const getButtonText = () => {
    if (loading) return "Processing...";
    return "Place Order";
  };

  const shippingPrice = 5.0;
  const originalTotal = totalPrice + shippingPrice;
  const discountedTotal = calculateDiscountedTotal();
  const discountAmount = originalTotal - discountedTotal;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-center gap-8">
          {/* Left Column - 35% - All Forms in One Card */}
          <div className="lg:w-[35%]">
            <form onSubmit={handlePlaceOrder}>
              {/* Single Card containing all form sections */}
              <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6">
                {/* Contact - with sign in link on right */}
                <div className="mb-5 pb-5 border-b border-gray-100">
                  <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
                    <h2 className="text-base md:text-lg font-medium text-[#2C2C2C]">Contact</h2>
                    {!user && (
                      <Link to="/login" state={{ from: "/checkout" }}>
                        <div className="flex items-center gap-1 text-[#D4A574] hover:text-[#2C2C2C] transition text-xs md:text-sm">
                          <FiUser className="w-3 h-3 md:w-4 md:h-4" />
                          <span>Sign in</span>
                        </div>
                      </Link>
                    )}
                    {user && (
                      <div className="flex items-center gap-1 text-green-600 text-xs md:text-sm">
                        <FiCheck className="w-3 h-3 md:w-4 md:h-4" />
                        <span>{user.name?.split(" ")[0]}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm text-gray-600 mb-1">
                      Email or mobile phone number
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4A574] text-sm"
                      placeholder="Email or mobile number"
                    />
                  </div>
                  <label className="flex items-center gap-2 mt-2 text-xs md:text-sm text-gray-600">
                    <input type="checkbox" className="rounded" />
                    Email me with news and offers
                  </label>
                </div>

                {/* Delivery */}
                <div className="mb-5 pb-5 border-b border-gray-100">
                  <h2 className="text-base md:text-lg font-medium text-[#2C2C2C] mb-3 md:mb-4">
                    Delivery
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-xs md:text-sm text-gray-600 mb-1">
                        Country/Region
                      </label>
                      <input
                        type="text"
                        value="Pakistan"
                        disabled
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm text-gray-600 mb-1">
                        First name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4A574] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm text-gray-600 mb-1">
                        Last name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4A574] text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs md:text-sm text-gray-600 mb-1">
                        Company (optional)
                      </label>
                      <input
                        type="text"
                        name="company"
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4A574] text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs md:text-sm text-gray-600 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4A574] text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs md:text-sm text-gray-600 mb-1">
                        Apartment, suite, etc. (optional)
                      </label>
                      <input
                        type="text"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleChange}
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4A574] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm text-gray-600 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4A574] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm text-gray-600 mb-1">
                        Province/State
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4A574] bg-white text-sm"
                      >
                        <option value="">Select Province</option>
                        {pakistanProvinces.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm text-gray-600 mb-1">
                        Postal code (optional)
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4A574] text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs md:text-sm text-gray-600 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4A574] text-sm"
                        placeholder="+92 123 4567890"
                      />
                    </div>
                  </div>

                  <div className="mt-3 space-y-1">
                    <label className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={saveInfo}
                        onChange={(e) => setSaveInfo(e.target.checked)}
                        className="rounded"
                      />
                      Save this information for next time
                    </label>
                    <label className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={textOffers}
                        onChange={(e) => setTextOffers(e.target.checked)}
                        className="rounded"
                      />
                      Text me with news and offers
                    </label>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs md:text-sm text-gray-600 mb-1">
                      CRO / BA code (optional)
                    </label>
                    <input
                      type="text"
                      name="croCode"
                      value={formData.croCode}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4A574] text-sm"
                    />
                  </div>
                </div>

                {/* Billing Address Options */}
                <div className="mb-5 pb-5 border-b border-gray-100">
                  <h2 className="text-base md:text-lg font-medium text-[#2C2C2C] mb-3">
                    Billing address
                  </h2>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                      <input
                        type="radio"
                        name="billingOption"
                        value="same"
                        checked={billingOption === "same"}
                        onChange={() => setBillingOption("same")}
                        className="rounded-full"
                      />
                      Same as shipping address
                    </label>
                    <label className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                      <input
                        type="radio"
                        name="billingOption"
                        value="different"
                        checked={billingOption === "different"}
                        onChange={() => setBillingOption("different")}
                        className="rounded-full"
                      />
                      Use a different billing address
                    </label>
                  </div>
                </div>

                {/* Different Billing Address Form */}
                {billingOption === "different" && (
                  <div className="mb-5 pb-5 border-b border-gray-100">
                    <h2 className="text-base md:text-lg font-medium text-[#2C2C2C] mb-3">
                      Billing address
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="md:col-span-2">
                        <label className="block text-xs md:text-sm text-gray-600 mb-1">
                          Country/Region
                        </label>
                        <input
                          type="text"
                          value="Pakistan"
                          disabled
                          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm text-gray-600 mb-1">
                          First name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={billingData.firstName}
                          onChange={handleBillingChange}
                          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4A574] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm text-gray-600 mb-1">
                          Last name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={billingData.lastName}
                          onChange={handleBillingChange}
                          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4A574] text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs md:text-sm text-gray-600 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={billingData.address}
                          onChange={handleBillingChange}
                          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4A574] text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs md:text-sm text-gray-600 mb-1">
                          Apartment, suite, etc. (optional)
                        </label>
                        <input
                          type="text"
                          name="apartment"
                          value={billingData.apartment}
                          onChange={handleBillingChange}
                          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4A574] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm text-gray-600 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={billingData.city}
                          onChange={handleBillingChange}
                          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4A574] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm text-gray-600 mb-1">
                          Postal code (optional)
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={billingData.zipCode}
                          onChange={handleBillingChange}
                          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4A574] text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs md:text-sm text-gray-600 mb-1">
                          Phone (optional)
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={billingData.phone}
                          onChange={handleBillingChange}
                          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4A574] text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping Method */}
                <div className="mb-5 pb-5 border-b border-gray-100">
                  <h2 className="text-base md:text-lg font-medium text-[#2C2C2C] mb-3">
                    Shipping method
                  </h2>
                  <div className="flex flex-wrap justify-between items-center p-2 md:p-3 border rounded-lg bg-gray-50">
                    <span className="text-xs md:text-sm text-gray-700">Standard Shipping</span>
                    <span className="text-xs md:text-sm text-gray-800 font-medium">
                      ${shippingPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[10px] md:text-xs text-gray-400 mt-1">
                    Delivery within 3-5 business days
                  </p>
                </div>

                {/* Payment */}
                <div className="mb-5">
                  <h2 className="text-base md:text-lg font-medium text-[#2C2C2C] mb-2">
                    Payment
                  </h2>
                  <p className="text-[10px] md:text-xs text-gray-500 mb-3">
                    All transactions are secure and encrypted.
                  </p>

                  <div className="space-y-2">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center p-3 border rounded-xl cursor-pointer transition ${
                          selectedPaymentMethod === method.id
                            ? "border-[#D4A574] bg-[#D4A574]/5"
                            : "border-gray-200 hover:border-[#D4A574]/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={(e) =>
                            setSelectedPaymentMethod(e.target.value)
                          }
                          className="w-3.5 h-3.5 text-[#D4A574] focus:ring-[#D4A574]"
                        />
                        <span className="text-xl ml-2">{method.icon}</span>
                        <div className="ml-2 flex-1">
                          <p className="font-medium text-sm text-[#2C2C2C]">
                            {method.name}
                          </p>
                          {method.description && (
                            <p className="text-[10px] text-gray-500">
                              {method.description}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Bank Transfer Details - Shown directly when selected */}
                  {selectedPaymentMethod === "bank_transfer" && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h4 className="font-semibold text-[#2C2C2C] text-sm mb-3 flex items-center gap-2">
                        <FiCreditCard className="text-[#D4A574]" />
                        Bank Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-1 border-b border-gray-200">
                          <span className="text-gray-500">Bank Name:</span>
                          <span className="text-[#2C2C2C] font-medium">MCB BANK LIMITED</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-200">
                          <span className="text-gray-500">Account Title:</span>
                          <span className="text-[#2C2C2C] font-medium">MUHAMMAD ASAD KHAN</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-200">
                          <span className="text-gray-500">Account Number:</span>
                          <span className="text-[#2C2C2C] font-mono font-medium">16405602009809</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-200">
                          <span className="text-gray-500">IBAN:</span>
                          <span className="text-[#2C2C2C] font-mono text-sm">PK36MCBA16405602009809</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <h5 className="font-semibold text-yellow-800 text-xs mb-2">Payment Instructions:</h5>
                        <ul className="text-[10px] text-yellow-700 space-y-1">
                          <li>1. Transfer the exact amount to the MCB Bank account above</li>
                          <li>2. After completing your payment transfer, please send the payment screenshot to our WhatsApp number below for verification</li>
                        </ul>
                      </div>
                      
                      <div className="mt-3 p-3 bg-green-50 rounded-lg text-center border border-green-200">
                        <p className="text-xs text-green-700 mb-1">📱 Send payment screenshot to WhatsApp:</p>
                        <p className="font-bold text-green-800 text-base">+92 341 9443586</p>
                      </div>
                    </div>
                  )}

                  {/* Cash on Delivery Info */}
                  {selectedPaymentMethod === "cod" && (
                    <div className="mt-3 p-3 bg-green-50 rounded-xl">
                      <h4 className="font-medium text-green-800 text-xs mb-1">
                        Cash on Delivery
                      </h4>
                      <ul className="text-[10px] text-green-700 space-y-1">
                        <li>✓ Pay exact cash amount to the delivery person</li>
                        <li>✓ Keep exact change ready for smooth delivery</li>
                        <li>✓ Inspect the package before making payment</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Dynamic Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50 ${
                    selectedPaymentMethod === "cod"
                      ? "bg-[#2C2C2C] hover:bg-[#D4A574]"
                      : "bg-[#D4A574] hover:bg-[#2C2C2C]"
                  }`}
                >
                  {getButtonText()}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - 35% - Order Summary */}
          <div className="lg:w-[35%]">
            <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6 sticky top-24">
              <h3 className="text-base md:text-lg font-medium text-[#2C2C2C] mb-3">
                Order summary
              </h3>

              {/* Order Items */}
              <div className="max-h-80 overflow-y-auto">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-3 mb-3 pb-3 border-b border-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 md:w-14 md:h-14 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-xs md:text-sm font-medium text-[#2C2C2C]">
                        {item.name.length > 25 ? item.name.substring(0, 25) + "..." : item.name}
                      </p>
                      {item.selectedSize && (
                        <p className="text-[10px] text-gray-500">
                          Size: {item.selectedSize}
                        </p>
                      )}
                      {item.selectedColor && (
                        <p className="text-[10px] text-gray-500">
                          Color: {item.selectedColor}
                        </p>
                      )}
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs md:text-sm font-medium text-[#2C2C2C]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Summary with Discount */}
              <div className="space-y-1 pt-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-[#2C2C2C]">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-[#2C2C2C]">
                    ${shippingPrice.toFixed(2)}
                  </span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-xs text-green-600">
                    <span className="flex items-center gap-1">
                      Discount ({appliedDiscount.description})
                      <button
                        onClick={handleRemoveDiscount}
                        className="text-red-500 hover:text-red-700"
                        title="Remove discount"
                      >
                        <FiTrash2 className="w-3 h-3" />
                      </button>
                    </span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-sm text-[#2C2C2C]">Total</span>
                    <span className="text-base text-[#2C2C2C] font-bold">
                      ${discountedTotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">USD</p>
                </div>
              </div>

              {/* Discount Code */}
              <div className="mt-3 pt-3 border-t">
                {!appliedDiscount ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#D4A574]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200 transition"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-xs text-green-600">
                    Discount applied! 🎉
                  </div>
                )}
                {discountError && (
                  <p className="text-[10px] text-red-500 mt-1 text-center">{discountError}</p>
                )}
              </div>

              {/* Professional Payment Icons */}
              <div className="mt-4 pt-3 border-t">
                <p className="text-[10px] text-gray-500 text-center mb-2">
                  Secured payment methods
                </p>
                <div className="flex flex-wrap justify-center items-center gap-3">
                  <div className="bg-white rounded border border-gray-200 p-1 shadow-sm">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/en/4/42/MCB_Bank_Limited_logo.png"
                      alt="MCB Bank"
                      className="h-5 w-auto"
                    />
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-1 shadow-sm">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
                      alt="Mastercard"
                      className="h-5 w-auto"
                    />
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-1 shadow-sm">
                    <img 
                      src="https://img.icons8.com/color/48/visa.png"
                      alt="Visa"
                      className="h-5 w-auto"
                    />
                  </div>
                </div>
                <p className="text-center text-[10px] text-gray-400 mt-2 flex items-center justify-center gap-1">
                  <FiLock className="w-3 h-3" /> 100% Safe Checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;