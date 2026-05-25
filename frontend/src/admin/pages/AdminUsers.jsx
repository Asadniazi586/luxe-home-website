import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiTrash2, FiMail, FiCalendar } from 'react-icons/fi'
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

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-light text-gray-800">Users</h1>
        <p className="text-gray-500 mt-1">Manage registered customers</p>
      </div>

      {fetchLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-3 border-warm border-t-transparent rounded-full animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <FiUsers className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">No users found</h3>
          <p className="text-gray-500 mt-1">Users will appear here when customers register</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-warm/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-warm">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FiMail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
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
      )}
    </AdminLayout>
  )
}

export default AdminUsers