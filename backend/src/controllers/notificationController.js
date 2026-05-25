import Notification from '../models/Notification.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private/Admin
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ forAdmin: true })
      .sort({ createdAt: -1 })
      .limit(50);
    
    const unreadCount = await Notification.countDocuments({ forAdmin: true, isRead: false });
    
    res.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private/Admin
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (notification) {
      notification.isRead = true;
      await notification.save();
      res.json({ message: 'Notification marked as read' });
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private/Admin
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ forAdmin: true, isRead: false }, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private/Admin
export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create notification (internal function)
export const createNotification = async (title, message, type, metadata = {}) => {
  try {
    const notification = new Notification({
      title,
      message,
      type,
      forAdmin: true,
      metadata,
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// @desc    Create order notification
export const createOrderNotification = async (order) => {
  const title = 'New Order Received!';
  const message = `Order #${order._id.toString().slice(-8).toUpperCase()} for $${order.totalPrice} has been placed.`;
  const metadata = { orderId: order._id, total: order.totalPrice };
  
  return await createNotification(title, message, 'order', metadata);
};

// @desc    Create low stock notification
export const createLowStockNotification = async (product) => {
  const title = 'Low Stock Alert!';
  const message = `Product "${product.name}" is low in stock. Only ${product.countInStock} left!`;
  const metadata = { productId: product._id, stock: product.countInStock };
  
  return await createNotification(title, message, 'stock', metadata);
};

// @desc    Create user registration notification
export const createUserRegistrationNotification = async (user) => {
  const title = 'New User Registered';
  const message = `${user.name} (${user.email}) has created an account.`;
  const metadata = { userId: user._id, email: user.email };
  
  return await createNotification(title, message, 'user', metadata);
};

// @desc    Create order status update notification
export const createOrderStatusNotification = async (order, oldStatus, newStatus) => {
  const title = `Order Status Updated`;
  const message = `Order #${order._id.toString().slice(-8).toUpperCase()} status changed from ${oldStatus} to ${newStatus}.`;
  const metadata = { orderId: order._id, oldStatus, newStatus };
  
  return await createNotification(title, message, 'order', metadata);
};