import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiTrash2, FiMail, FiCalendar, FiUser, FiMoreVertical } from 'react-icons/fi'
import { useAdmin } from '../../contexts/AdminContext'
import AdminLayout from '../components/AdminLayout'
import toast from 'react-hot-toast'

const AdminUsers = () => {
  const { getAllUsers, deleteUser, loading } = useAdmin()
  const [users, setUsers] = useState([])
  const [fetchLoading, setFetchLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setFetchLoading(true)
      const data = await getAllUsers()
      setUsers(data)
    } catch (error) {
      toast.error('Failed to fetch users')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      try {
        await deleteUser(id)
        toast.success('User deleted successfully')
        fetchUsers()
      } catch (error) {
        toast.error('Failed to delete user')
      }
    }
  }

  const getRoleBadge = (role) => {
    return role === 'admin' 
      ? 'bg-purple-100 text-purple-700' 
      : 'bg-gray-100 text-gray-700'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-light text-gray-800">Users</h1>
        <p className="text-gray-500 text-sm mt-1">Manage registered customers</p>
      </div>

      {fetchLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-3 border-warm border-t-transparent rounded-full animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-xl p-8 sm:p-12 text-center">
          <FiUsers className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-700">No users found</h3>
          <p className="text-gray-500 text-sm mt-1">Users will appear here when customers register</p>
        </div>
      ) : (
        <>
          {/* Mobile Card View (visible on small screens) */}
          <div className="block sm:hidden space-y-4">
            {users.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-warm/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-base font-medium text-warm">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-800">{user.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => handleDeleteUser(user._id, user.name)}
                      className="p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
                
                <div className="mt-3 space-y-2 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiMail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="break-all">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiCalendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop Table View (visible on larger screens) */}
          <div className="hidden sm:block bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-warm/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-warm">
                              {user.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-800 line-clamp-1 max-w-[150px]">{user.name}</span>
                        </div>
                       </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FiMail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-600 line-clamp-1 max-w-[200px]">{user.email}</span>
                        </div>
                       </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadge(user.role)}`}>
                          {user.role}
                        </span>
                       </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-600 whitespace-nowrap">
                            {formatDate(user.createdAt)}
                          </span>
                        </div>
                       </td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            className="p-1 text-red-500 hover:text-red-700 transition"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        )}
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

export default AdminUsers