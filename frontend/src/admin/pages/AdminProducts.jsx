import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiEdit2, FiTrash2, FiSearch, FiPackage, FiGrid } from 'react-icons/fi'
import { useAdmin } from '../../contexts/AdminContext'
import AdminLayout from '../components/AdminLayout'
import toast from 'react-hot-toast'

const AdminProducts = () => {
  const navigate = useNavigate()
  const { getProducts, deleteProduct } = useAdmin()
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [fetchLoading, setFetchLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setFetchLoading(true)
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      toast.error('Failed to fetch products')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteProduct(id)
        toast.success('Product deleted successfully')
        fetchProducts()
      } catch (error) {
        toast.error('Failed to delete product')
      }
    }
  }

  const handleEditProduct = (product) => {
    navigate('/admin/add-product', { state: { product, isEditing: true } })
  }

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-light text-gray-800">Products</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your product inventory</p>
      </div>

      <div className="relative mb-6">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm text-sm sm:text-base"
        />
      </div>

      {fetchLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-3 border-warm border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl p-8 sm:p-12 text-center">
          <FiPackage className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-700">No products found</h3>
          <p className="text-gray-500 text-sm mt-1">Click "Add Product" from the sidebar to create your first product</p>
        </div>
      ) : (
        <>
          {/* Mobile Card View (visible on small screens) */}
          <div className="block sm:hidden space-y-4">
            {filteredProducts.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
              >
                <div className="flex gap-4">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-xs text-gray-500 capitalize mb-1">{product.category}</p>
                    <p className="text-base font-semibold text-gray-800">${product.price}</p>
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex items-center gap-1 px-3 py-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-sm"
                  >
                    <FiEdit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id, product.name)}
                    className="flex items-center gap-1 px-3 py-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition text-sm"
                  >
                    <FiTrash2 size={14} /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop Table View (visible on larger screens) */}
          <div className="hidden sm:block bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-4 md:px-6 py-4">
                        <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className="text-sm font-medium text-gray-800 line-clamp-2 max-w-[200px]">{product.name}</span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className="text-sm text-gray-600 capitalize">{product.category}</span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className="text-sm text-gray-800">${product.price}</span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-1 text-blue-500 hover:text-blue-700 mr-2 transition"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id, product.name)}
                          className="p-1 text-red-500 hover:text-red-700 transition"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}

export default AdminProducts