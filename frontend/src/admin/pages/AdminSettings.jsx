import React, { useState } from 'react'
import { FiSave, FiBell, FiShield, FiGlobe } from 'react-icons/fi'
import AdminLayout from '../components/AdminLayout'
import toast from 'react-hot-toast'

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'LUXE HOME',
    siteEmail: 'hello@luxehome.com',
    currency: 'USD',
    taxRate: 10,
    freeShippingThreshold: 100,
    maintenanceMode: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Settings saved successfully!')
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-light text-gray-800">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your store settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <FiGlobe className="text-warm" /> General Settings
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-warm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Email</label>
              <input
                type="email"
                name="siteEmail"
                value={settings.siteEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-warm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-warm"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
              <input
                type="number"
                name="taxRate"
                value={settings.taxRate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-warm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold ($)</label>
              <input
                type="number"
                name="freeShippingThreshold"
                value={settings.freeShippingThreshold}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-warm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <FiBell className="text-warm" /> Notification Settings
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Email notifications for new orders</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-warm focus:ring-warm" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Email notifications for low stock</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-warm focus:ring-warm" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Daily sales report</span>
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-warm focus:ring-warm" />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <FiShield className="text-warm" /> Security Settings
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Maintenance Mode</span>
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-warm focus:ring-warm"
              />
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Change Admin Password</label>
              <input
                type="password"
                placeholder="New password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-warm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-charcoal text-white rounded-lg hover:bg-charcoal-light transition"
          >
            <FiSave size={18} /> Save Changes
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}

export default AdminSettings