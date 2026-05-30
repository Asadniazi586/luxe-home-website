import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  // Redirect admin to shop
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/shop');
    }
  }, [user, navigate]);

  // Bank selection state
  const [selectedBank, setSelectedBank] = useState(null);
  const [bankSearchTerm, setBankSearchTerm] = useState("");
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [bankAccountTitle, setBankAccountTitle] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankIban, setBankIban] = useState("");

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
      id: "payfast",
      name: "PAYFAST",
      icon: "💳",
      description: "Pay via Debit/Credit/Wallet/Bank Account",
    },
    {
      id: "alfalah",
      name: "Alfalah Payment Gateway",
      icon: "🏦",
      description: "Direct bank transfer",
    },
    {
      id: "baadmay",
      name: "BaadMay | Buy Now. Pay Later",
      icon: "📅",
      description: "Split payments into 3 easy installments",
    },
  ];

  // Bank Accounts Data
  const bankAccounts = [
    {
      id: 1,
      bankName: "Habib Bank Limited (HBL)",
      accountTitle: "LUXE HOME Pvt Ltd",
      accountNumber: "1234-567890-01",
      iban: "PK36HABB0012345678901",
      swiftCode: "HABBPKKA",
    },
    {
      id: 2,
      bankName: "United Bank Limited (UBL)",
      accountTitle: "LUXE HOME Pvt Ltd",
      accountNumber: "9876-543210-02",
      iban: "PK78UNIL0098765432102",
      swiftCode: "UNILPKKA",
    },
    {
      id: 3,
      bankName: "Meezan Bank",
      accountTitle: "LUXE HOME Pvt Ltd",
      accountNumber: "2468-135790-03",
      iban: "PK92MEZN0024681357903",
      swiftCode: "MEZNPKKA",
    },
    {
      id: 4,
      bankName: "Bank Alfalah",
      accountTitle: "LUXE HOME Pvt Ltd",
      accountNumber: "1357-924680-04",
      iban: "PK45ALFH0013579246804",
      swiftCode: "ALFHPKKA",
    },
    {
      id: 5,
      bankName: "National Bank of Pakistan (NBP)",
      accountTitle: "LUXE HOME Pvt Ltd",
      accountNumber: "5791-346820-05",
      iban: "PK63NBPA0057913468205",
      swiftCode: "NBPPPKKA",
    },
  ];

  const filteredBanks = bankAccounts.filter((bank) =>
    bank.bankName.toLowerCase().includes(bankSearchTerm.toLowerCase()),
  );

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setBankAccountTitle(bank.accountTitle);
    setBankAccountNumber(bank.accountNumber);
    setBankIban(bank.iban);
    setBankSearchTerm(bank.bankName);
    setShowBankDropdown(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBillingChange = (e) => {
    setBillingData({ ...billingData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

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
      const total = totalPrice + shippingPrice;

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
            : selectedPaymentMethod === "payfast"
              ? "PAYFAST"
              : selectedPaymentMethod === "alfalah"
                ? "Alfalah Gateway"
                : "BaadMay",
        itemsPrice: totalPrice,
        shippingPrice,
        totalPrice: total,
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
          total: total,
          paymentStatus:
            selectedPaymentMethod === "cod"
              ? "Pending"
              : "Awaiting Confirmation",
          paymentMethod:
            selectedPaymentMethod === "cod"
              ? "Cash on Delivery"
              : selectedPaymentMethod === "payfast"
                ? "PAYFAST"
                : selectedPaymentMethod === "alfalah"
                  ? "Alfalah Gateway"
                  : "BaadMay",
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
          JSON.stringify(orderSuccessData),
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
    if (selectedPaymentMethod === "cod") return "Complete order";
    return "Pay now";
  };

  const shippingPrice = 5.0;
  const finalTotal = totalPrice + shippingPrice;

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - All Forms */}
          <div className="flex-1">
            <form onSubmit={handlePlaceOrder}>
              {/* Contact */}
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Contact
                </h2>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                  />
                </div>
                <label className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                  <input type="checkbox" className="rounded" />
                  Email me with news and offers
                </label>
              </div>

              {/* Delivery */}
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Delivery
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      First name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Last name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">
                      Apartment, suite, etc. (optional)
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Province/State
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm bg-white"
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
                    <label className="block text-sm text-gray-600 mb-1">
                      Postal code (optional)
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                      placeholder="+92 123 4567890"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={saveInfo}
                      onChange={(e) => setSaveInfo(e.target.checked)}
                      className="rounded"
                    />
                    Save this information for next time
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={textOffers}
                      onChange={(e) => setTextOffers(e.target.checked)}
                      className="rounded"
                    />
                    Text me with news and offers
                  </label>
                </div>

                <div className="mt-4">
                  <label className="block text-sm text-gray-600 mb-1">
                    CRO / BA code (optional)
                  </label>
                  <input
                    type="text"
                    name="croCode"
                    value={formData.croCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                  />
                </div>
              </div>

              {/* Billing Address Options */}
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Billing address
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
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
                  <label className="flex items-center gap-2 text-sm text-gray-600">
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
                <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">
                    Billing address
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">
                        Country/Region
                      </label>
                      <input
                        type="text"
                        value="Pakistan"
                        disabled
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        First name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={billingData.firstName}
                        onChange={handleBillingChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Last name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={billingData.lastName}
                        onChange={handleBillingChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={billingData.address}
                        onChange={handleBillingChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">
                        Apartment, suite, etc. (optional)
                      </label>
                      <input
                        type="text"
                        name="apartment"
                        value={billingData.apartment}
                        onChange={handleBillingChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={billingData.city}
                        onChange={handleBillingChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Postal code (optional)
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={billingData.zipCode}
                        onChange={handleBillingChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">
                        Phone (optional)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={billingData.phone}
                        onChange={handleBillingChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Method */}
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Shipping method
                </h2>
                <div className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                  <span className="text-gray-700">Standard Shipping</span>
                  <span className="text-gray-800 font-medium">
                    ${shippingPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Delivery within 3-5 business days
                </p>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <h2 className="text-lg font-medium text-gray-800 mb-2">
                  Payment
                </h2>
                <p className="text-xs text-gray-500 mb-4">
                  All transactions are secure and encrypted.
                </p>

                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${
                        selectedPaymentMethod === method.id
                          ? "border-warm bg-warm/5"
                          : "border-gray-200 hover:border-warm/50"
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
                        className="w-4 h-4 text-warm focus:ring-warm"
                      />
                      <span className="text-2xl ml-3">{method.icon}</span>
                      <div className="ml-3 flex-1">
                        <p className="font-medium text-gray-800">
                          {method.name}
                        </p>
                        {method.description && (
                          <p className="text-xs text-gray-500">
                            {method.description}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                {/* Payment Method Specific Info */}
                {selectedPaymentMethod === "cod" && (
                  <div className="mt-4 p-4 bg-green-50 rounded-xl">
                    <h4 className="font-medium text-green-800 mb-2">
                      Cash on Delivery
                    </h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>✓ Pay exact cash amount to the delivery person</li>
                      <li>✓ Keep exact change ready for smooth delivery</li>
                      <li>✓ Inspect the package before making payment</li>
                    </ul>
                  </div>
                )}

                {selectedPaymentMethod === "baadmay" && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-xl">
                    <h4 className="font-medium text-purple-800 mb-2">
                      Buy Now, Pay Later with BaadMay
                    </h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>✓ Split your payments into 3 easy installments</li>
                      <li>✓ No interest, no hidden fees</li>
                      <li>✓ Instant approval process</li>
                      <li>✓ Pay 1st installment at delivery</li>
                    </ul>
                  </div>
                )}

                {(selectedPaymentMethod === "payfast" ||
                  selectedPaymentMethod === "alfalah") && (
                  <div className="mt-6 space-y-5">
                    <div className="bg-gray-50 rounded-xl p-5">
                      <h4 className="font-medium text-charcoal mb-4 flex items-center gap-2">
                        <FiCreditCard className="text-warm" />
                        Bank Account Details
                      </h4>

                      <div className="mb-4 relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Bank *
                        </label>
                        <div className="relative">
                          <div
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white flex items-center justify-between cursor-pointer hover:border-warm transition"
                            onClick={() =>
                              setShowBankDropdown(!showBankDropdown)
                            }
                          >
                            <span
                              className={
                                selectedBank ? "text-gray-800" : "text-gray-400"
                              }
                            >
                              {selectedBank
                                ? selectedBank.bankName
                                : "Choose your bank"}
                            </span>
                            <FiChevronDown
                              className={`text-gray-400 transition-transform ${showBankDropdown ? "rotate-180" : ""}`}
                            />
                          </div>

                          {showBankDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                              <div className="p-2 border-b border-gray-100">
                                <input
                                  type="text"
                                  placeholder="Search bank..."
                                  value={bankSearchTerm}
                                  onChange={(e) =>
                                    setBankSearchTerm(e.target.value)
                                  }
                                  className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-warm"
                                  autoFocus
                                />
                              </div>
                              <div className="max-h-60 overflow-y-auto">
                                {filteredBanks.length > 0 ? (
                                  filteredBanks.map((bank) => (
                                    <div
                                      key={bank.id}
                                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                                      onClick={() => handleBankSelect(bank)}
                                    >
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <p className="font-medium text-gray-800 text-sm">
                                            {bank.bankName}
                                          </p>
                                          <p className="text-xs text-gray-500 mt-0.5">
                                            IBAN: {bank.iban}
                                          </p>
                                        </div>
                                        {selectedBank?.id === bank.id && (
                                          <FiCheck className="text-green-500" />
                                        )}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                    No banks found
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {selectedBank && (
                        <div className="bg-white rounded-lg p-4 border border-warm/20 mb-4">
                          <p className="text-xs text-warm font-medium mb-2">
                            SELECTED BANK
                          </p>
                          <p className="font-medium text-gray-800">
                            {selectedBank.bankName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            SWIFT: {selectedBank.swiftCode}
                          </p>
                        </div>
                      )}

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Title *
                        </label>
                        <input
                          type="text"
                          value={bankAccountTitle}
                          onChange={(e) => setBankAccountTitle(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-warm"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Number *
                        </label>
                        <input
                          type="text"
                          value={bankAccountNumber}
                          onChange={(e) => setBankAccountNumber(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-warm"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          IBAN *
                        </label>
                        <input
                          type="text"
                          value={bankIban}
                          onChange={(e) => setBankIban(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-warm"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4">
                      <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                        <FiHome className="text-blue-600" />
                        Transfer Instructions
                      </h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>
                          ✓ Please transfer the exact total amount to the
                          selected bank account
                        </li>
                        <li>
                          ✓ Use your Order ID as reference after placing order
                        </li>
                        <li>
                          ✓ Upload payment proof or send via email to
                          payments@luxehome.com
                        </li>
                        <li>
                          ✓ Order will be confirmed within 24 hours of payment
                          confirmation
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white px-8 py-3 rounded-lg text-base font-semibold transition disabled:opacity-50 ${
                  selectedPaymentMethod === "cod"
                    ? "bg-charcoal hover:bg-charcoal-light"
                    : "bg-warm hover:bg-warm/80"
                }`}
              >
                {getButtonText()}
              </button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Order summary
              </h3>

              {/* Order Items */}
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex gap-3 mb-4 pb-4 border-b">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {item.name}
                    </p>
                    {item.selectedSize && (
                      <p className="text-xs text-gray-500">
                        Size: {item.selectedSize}
                      </p>
                    )}
                    {item.selectedColor && (
                      <p className="text-xs text-gray-500">
                        Color: {item.selectedColor}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              {/* Price Summary */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-800">
                    ${shippingPrice.toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-800">Total</span>
                    <span className="text-gray-800 text-lg">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">USD</p>
                </div>
              </div>

              {/* Discount Code */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Discount code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-warm"
                  />
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">
                    Apply
                  </button>
                </div>
              </div>

              {/* Professional Payment Icons */}
              <div className="mt-6 pt-4 border-t">
                <p className="text-xs text-gray-500 text-center mb-3">
                  Secured payment methods
                </p>
                <div className="flex justify-center items-center gap-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
                    <svg
                      width="45"
                      height="28"
                      viewBox="0 0 75 45"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="75" height="45" rx="6" fill="#1434CB" />
                      <text
                        x="10"
                        y="30"
                        fill="white"
                        fontSize="12"
                        fontWeight="bold"
                        fontFamily="Arial"
                      >
                        VISA
                      </text>
                    </svg>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
                    <svg
                      width="45"
                      height="28"
                      viewBox="0 0 75 45"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="75" height="45" rx="6" fill="#F79E1B" />
                      <text
                        x="8"
                        y="30"
                        fill="white"
                        fontSize="12"
                        fontWeight="bold"
                        fontFamily="Arial"
                      >
                        MC
                      </text>
                    </svg>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
                    <svg
                      width="45"
                      height="28"
                      viewBox="0 0 75 45"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="75" height="45" rx="6" fill="#006FCF" />
                      <text
                        x="8"
                        y="28"
                        fill="white"
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="Arial"
                      >
                        AMEX
                      </text>
                    </svg>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
                    <svg
                      width="45"
                      height="28"
                      viewBox="0 0 75 45"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="75" height="45" rx="6" fill="#179BD7" />
                      <text
                        x="10"
                        y="28"
                        fill="white"
                        fontSize="14"
                        fontWeight="bold"
                        fontFamily="Arial"
                      >
                        PayPal
                      </text>
                    </svg>
                  </div>
                </div>
                <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
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