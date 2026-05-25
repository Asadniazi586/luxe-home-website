import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { orderService } from '../services/orderService'
import toast from 'react-hot-toast'
import { FiSearch, FiChevronDown, FiCheck, FiCreditCard, FiHome } from 'react-icons/fi'

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod')
  
  // Bank selection state
  const [selectedBank, setSelectedBank] = useState(null)
  const [bankSearchTerm, setBankSearchTerm] = useState('')
  const [showBankDropdown, setShowBankDropdown] = useState(false)
  const [bankAccountTitle, setBankAccountTitle] = useState('')
  const [bankAccountNumber, setBankAccountNumber] = useState('')
  const [bankIban, setBankIban] = useState('')
  
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'PK',
    phone: '',
  })

  // Pakistan Provinces
  const pakistanProvinces = [
    'Punjab',
    'Sindh',
    'Khyber Pakhtunkhwa',
    'Balochistan',
    'Gilgit-Baltistan'
  ]

  // Bank Accounts Data
  const bankAccounts = [
    { 
      id: 1,
      bankName: 'Habib Bank Limited (HBL)', 
      accountTitle: 'LUXE HOME Pvt Ltd',
      accountNumber: '1234-567890-01',
      iban: 'PK36HABB0012345678901',
      branchCode: '0123',
      swiftCode: 'HABBPKKA'
    },
    { 
      id: 2,
      bankName: 'United Bank Limited (UBL)', 
      accountTitle: 'LUXE HOME Pvt Ltd',
      accountNumber: '9876-543210-02',
      iban: 'PK78UNIL0098765432102',
      branchCode: '0456',
      swiftCode: 'UNILPKKA'
    },
    { 
      id: 3,
      bankName: 'Meezan Bank', 
      accountTitle: 'LUXE HOME Pvt Ltd',
      accountNumber: '2468-135790-03',
      iban: 'PK92MEZN0024681357903',
      branchCode: '0789',
      swiftCode: 'MEZNPKKA'
    },
    { 
      id: 4,
      bankName: 'Bank Alfalah', 
      accountTitle: 'LUXE HOME Pvt Ltd',
      accountNumber: '1357-924680-04',
      iban: 'PK45ALFH0013579246804',
      branchCode: '0321',
      swiftCode: 'ALFHPKKA'
    },
    { 
      id: 5,
      bankName: 'National Bank of Pakistan (NBP)', 
      accountTitle: 'LUXE HOME Pvt Ltd',
      accountNumber: '5791-346820-05',
      iban: 'PK63NBPA0057913468205',
      branchCode: '0654',
      swiftCode: 'NBPPPKKA'
    }
  ]

  // Filter banks based on search term
  const filteredBanks = bankAccounts.filter(bank =>
    bank.bankName.toLowerCase().includes(bankSearchTerm.toLowerCase())
  )

  const handleBankSelect = (bank) => {
    setSelectedBank(bank)
    setBankAccountTitle(bank.accountTitle)
    setBankAccountNumber(bank.accountNumber)
    setBankIban(bank.iban)
    setBankSearchTerm(bank.bankName)
    setShowBankDropdown(false)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (step === 1) {
      // Validate province is selected
      if (!formData.state) {
        toast.error('Please select a province')
        return
      }
      setStep(2)
      window.scrollTo(0, 0)
    } else if (step === 2) {
      // Validate bank details for bank transfer
      if (selectedPaymentMethod === 'bank') {
        if (!selectedBank) {
          toast.error('Please select a bank account')
          return
        }
        if (!bankAccountTitle || bankAccountTitle.trim() === '') {
          toast.error('Please enter account title')
          return
        }
        if (!bankAccountNumber || bankAccountNumber.trim() === '') {
          toast.error('Please enter account number')
          return
        }
        if (!bankIban || bankIban.trim() === '') {
          toast.error('Please enter IBAN')
          return
        }
      }
      setStep(3)
      window.scrollTo(0, 0)
    } else {
      setLoading(true)
      try {
        const orderItems = cartItems.map(item => ({
          product: item.id || item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          size: item.selectedSize || '',
          color: item.selectedColor || '',
        }))

        const taxPrice = totalPrice * 0.1
        const shippingPrice = totalPrice > 100 ? 0 : 10
        const total = totalPrice + taxPrice + shippingPrice

        // Bank transfer details if applicable
        const bankDetails = selectedPaymentMethod === 'bank' && selectedBank ? {
          bankName: selectedBank.bankName,
          accountTitle: bankAccountTitle,
          accountNumber: bankAccountNumber,
          iban: bankIban,
          swiftCode: selectedBank.swiftCode
        } : null

        const orderData = {
          orderItems,
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            postalCode: formData.zipCode,
            country: formData.country,
            phone: formData.phone,
            email: formData.email,
          },
          paymentMethod: selectedPaymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer',
          bankDetails,
          itemsPrice: totalPrice,
          taxPrice,
          shippingPrice,
          totalPrice: total,
        }

        const order = await orderService.createOrder(orderData)
        
        if (order && order._id) {
          const orderSuccessData = {
            orderId: order._id.slice(-8).toUpperCase(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            items: cartItems,
            shippingAddress: {
              name: `${formData.firstName} ${formData.lastName}`,
              address: formData.address,
              city: formData.city,
              postalCode: formData.zipCode,
              country: formData.country,
              phone: formData.phone,
              email: formData.email,
            },
            billingAddress: {
              name: `${formData.firstName} ${formData.lastName}`,
              address: formData.address,
              city: formData.city,
              postalCode: formData.zipCode,
              country: formData.country,
            },
            paymentMethod: selectedPaymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer',
            paymentStatus: selectedPaymentMethod === 'cod' ? 'Pending' : 'Awaiting Confirmation',
            subtotal: totalPrice,
            shippingCharge: shippingPrice,
            tax: taxPrice,
            total: total,
            bankDetails
          }
          
          localStorage.setItem('orderSuccessData', JSON.stringify(orderSuccessData))
          clearCart()
          toast.success('Order placed successfully!')
          navigate('/order-success', { state: orderSuccessData, replace: true })
        } else {
          toast.error('Failed to create order')
          setLoading(false)
        }
      } catch (error) {
        console.error('Order error:', error)
        toast.error(error.response?.data?.message || 'Failed to place order')
        setLoading(false)
      }
    }
  }

  if (cartItems.length === 0 && step === 1) {
    navigate('/cart')
    return null
  }

  const taxPrice = totalPrice * 0.1
  const shippingPrice = totalPrice > 100 ? 0 : 10
  const finalTotal = totalPrice + taxPrice + shippingPrice

  return (
    <div className="bg-cream min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-light tracking-wide text-charcoal mb-8">Checkout</h1>
        
        <div className="flex justify-between mb-8 max-w-2xl">
          {['Shipping', 'Payment', 'Review'].map((label, idx) => (
            <div key={label} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition ${
                step === idx + 1 ? 'bg-charcoal text-white' : step > idx + 1 ? 'bg-warm text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > idx + 1 ? '✓' : idx + 1}
              </div>
              <span className={`ml-2 text-sm ${step === idx + 1 ? 'text-charcoal font-medium' : 'text-gray-400'}`}>{label}</span>
              {idx < 2 && <div className="w-16 h-px bg-gray-200 mx-4" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.form
              key={step}
              initial={{ opacity: 0, x: step === 2 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              {step === 1 && (
                <div>
                  <h3 className="text-lg font-medium text-charcoal mb-4">Shipping Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">First Name</label>
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
                      <label className="block text-sm text-gray-600 mb-1">Last Name</label>
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
                      <label className="block text-sm text-gray-600 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                        placeholder="+92 123 4567890"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">Street Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">City</label>
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
                      <label className="block text-sm text-gray-600 mb-1">State / Province</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm bg-white"
                      >
                        <option value="">Select Province</option>
                        {pakistanProvinces.map(province => (
                          <option key={province} value={province}>{province}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Postal Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Country</label>
                      <input
                        type="text"
                        value="Pakistan"
                        disabled
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="text-lg font-medium text-charcoal mb-4">Select Payment Method</h3>
                  <div className="space-y-3 mb-6">
                    {/* Cash on Delivery Option */}
                    <label
                      className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${
                        selectedPaymentMethod === 'cod'
                          ? 'border-warm bg-warm/5'
                          : 'border-gray-200 hover:border-warm/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={selectedPaymentMethod === 'cod'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-warm focus:ring-warm"
                      />
                      <span className="text-2xl ml-3">💰</span>
                      <div className="ml-3 flex-1">
                        <p className="font-medium text-gray-800">Cash on Delivery</p>
                        <p className="text-xs text-gray-500">Pay when you receive your order</p>
                      </div>
                    </label>

                    {/* Bank Transfer Option */}
                    <label
                      className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${
                        selectedPaymentMethod === 'bank'
                          ? 'border-warm bg-warm/5'
                          : 'border-gray-200 hover:border-warm/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={selectedPaymentMethod === 'bank'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-warm focus:ring-warm"
                      />
                      <span className="text-2xl ml-3">🏦</span>
                      <div className="ml-3 flex-1">
                        <p className="font-medium text-gray-800">Bank Transfer</p>
                        <p className="text-xs text-gray-500">Direct bank transfer payment</p>
                      </div>
                    </label>
                  </div>

                  {/* Bank Transfer Details Section */}
                  {selectedPaymentMethod === 'bank' && (
                    <div className="mt-6 space-y-5">
                      <div className="bg-gray-50 rounded-xl p-5">
                        <h4 className="font-medium text-charcoal mb-4 flex items-center gap-2">
                          <FiCreditCard className="text-warm" />
                          Bank Account Details
                        </h4>
                        
                        {/* Bank Selection with Search */}
                        <div className="mb-4 relative">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Bank *
                          </label>
                          <div className="relative">
                            <div 
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white flex items-center justify-between cursor-pointer hover:border-warm transition"
                              onClick={() => setShowBankDropdown(!showBankDropdown)}
                            >
                              <span className={selectedBank ? 'text-gray-800' : 'text-gray-400'}>
                                {selectedBank ? selectedBank.bankName : 'Choose your bank'}
                              </span>
                              <FiChevronDown className={`text-gray-400 transition-transform ${showBankDropdown ? 'rotate-180' : ''}`} />
                            </div>
                            
                            {showBankDropdown && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                                <div className="p-2 border-b border-gray-100">
                                  <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                    <input
                                      type="text"
                                      placeholder="Search bank..."
                                      value={bankSearchTerm}
                                      onChange={(e) => setBankSearchTerm(e.target.value)}
                                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-warm"
                                      autoFocus
                                    />
                                  </div>
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                  {filteredBanks.length > 0 ? (
                                    filteredBanks.map(bank => (
                                      <div
                                        key={bank.id}
                                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                                        onClick={() => handleBankSelect(bank)}
                                      >
                                        <div className="flex justify-between items-center">
                                          <div>
                                            <p className="font-medium text-gray-800 text-sm">{bank.bankName}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">IBAN: {bank.iban}</p>
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

                        {/* Selected Bank Info Display */}
                        {selectedBank && (
                          <div className="bg-white rounded-lg p-4 border border-warm/20 mb-4">
                            <p className="text-xs text-warm font-medium mb-2">SELECTED BANK</p>
                            <p className="font-medium text-gray-800">{selectedBank.bankName}</p>
                            <p className="text-xs text-gray-500 mt-1">SWIFT: {selectedBank.swiftCode}</p>
                          </div>
                        )}

                        {/* Account Title Field */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Title *
                          </label>
                          <input
                            type="text"
                            value={bankAccountTitle}
                            onChange={(e) => setBankAccountTitle(e.target.value)}
                            placeholder="Enter account holder name"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-warm"
                            required={selectedPaymentMethod === 'bank'}
                          />
                          <p className="text-xs text-gray-400 mt-1">Must match the bank account owner's name</p>
                        </div>

                        {/* Account Number Field */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Number *
                          </label>
                          <input
                            type="text"
                            value={bankAccountNumber}
                            onChange={(e) => setBankAccountNumber(e.target.value)}
                            placeholder="XXXX-XXXXXXX-XX"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-warm font-mono"
                            required={selectedPaymentMethod === 'bank'}
                          />
                        </div>

                        {/* IBAN Field */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            IBAN *
                          </label>
                          <input
                            type="text"
                            value={bankIban}
                            onChange={(e) => setBankIban(e.target.value)}
                            placeholder="PK00XXXX0000000000000"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-warm font-mono text-sm uppercase"
                            required={selectedPaymentMethod === 'bank'}
                          />
                          <p className="text-xs text-gray-400 mt-1">International Bank Account Number (24 characters)</p>
                        </div>
                      </div>

                      {/* Bank Transfer Instructions */}
                      <div className="bg-blue-50 rounded-xl p-4">
                        <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                          <FiHome className="text-blue-600" />
                          Transfer Instructions
                        </h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>✓ Please transfer the exact total amount to the selected bank account</li>
                          <li>✓ Use your Order ID as reference after placing order</li>
                          <li>✓ Upload payment proof or send via email to payments@luxehome.com</li>
                          <li>✓ Order will be confirmed within 24 hours of payment confirmation</li>
                          <li>✓ Bank transfer fee (if any) will be borne by the customer</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === 'cod' && (
                    <div className="mt-4 p-4 bg-green-50 rounded-xl">
                      <h4 className="font-medium text-green-800 mb-2">Cash on Delivery Instructions</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>✓ Pay exact cash amount to the delivery person</li>
                        <li>✓ Keep exact change ready for smooth delivery</li>
                        <li>✓ Inspect the package before making payment</li>
                        <li>✓ Delivery within 3-5 business days across Pakistan</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="text-lg font-medium text-charcoal mb-4">Review Order</h3>
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h4 className="font-medium text-charcoal mb-2">Shipping Address</h4>
                      <p className="text-sm text-gray-600">
                        {formData.firstName} {formData.lastName}<br />
                        {formData.address}<br />
                        {formData.city}, {formData.state} {formData.zipCode}<br />
                        Pakistan<br />
                        Phone: {formData.phone}<br />
                        Email: {formData.email}
                      </p>
                    </div>
                    <div className="border-b pb-4">
                      <h4 className="font-medium text-charcoal mb-2">Payment Method</h4>
                      <p className="text-sm text-gray-600">
                        {selectedPaymentMethod === 'cod' ? '💰 Cash on Delivery' : '🏦 Bank Transfer'}
                      </p>
                      {selectedPaymentMethod === 'bank' && selectedBank && (
                        <div className="mt-2 text-xs text-gray-500">
                          <p>Bank: {selectedBank.bankName}</p>
                          <p>Account Title: {bankAccountTitle}</p>
                          <p>Account: {bankAccountNumber}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-charcoal mb-2">Order Summary</h4>
                      {cartItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-gray-600 py-2">
                          <span>{item.name} x {item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Subtotal</span>
                          <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Shipping</span>
                          <span>{shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Tax (10%)</span>
                          <span>${taxPrice.toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-medium text-charcoal">
                            <span>Total</span>
                            <span>${finalTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-6 pt-4 border-t">
                {step > 1 && (
                  <button type="button" onClick={() => setStep(step - 1)} className="text-gray-500 hover:text-charcoal transition">
                    Back
                  </button>
                )}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="ml-auto bg-charcoal text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-charcoal-light transition disabled:opacity-50"
                >
                  {loading ? 'Processing...' : step === 3 ? 'Place Order' : 'Continue'}
                </button>
              </div>
            </motion.form>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-24">
            <h3 className="text-lg font-medium text-charcoal mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm text-gray-600">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>{shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-medium text-charcoal">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">Pay with</p>
              <p className="font-medium text-charcoal">
                {selectedPaymentMethod === 'cod' ? '💰 Cash on Delivery' : '🏦 Bank Transfer'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout