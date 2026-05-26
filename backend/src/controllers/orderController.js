import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { createOrderNotification, createOrderStatusNotification } from './notificationController.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Generate order number explicitly
    const chars = '0123456789abcdef';
    let orderNumber = '';
    for (let i = 0; i < 6; i++) {
      orderNumber += chars[Math.floor(Math.random() * chars.length)];
    }

    const order = new Order({
      user: req.user.id,
      orderNumber: orderNumber,  // Add this explicitly
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    
    console.log('New order created with number:', createdOrder.orderNumber);
    
    // Create notification for admin
    await createOrderNotification(createdOrder);
    
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user.id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      const oldStatus = order.status;
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.status = 'Delivered';
      const updatedOrder = await order.save();
      
      // Create notification for order status update
      await createOrderStatusNotification(order, oldStatus, 'Delivered');
      
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const { status } = req.body;
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const oldStatus = order.status;
    order.status = status;
    
    // If status is Delivered, set deliveredAt date
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    
    await order.save();
    
    // Create notification for order status update
    await createOrderStatusNotification(order, oldStatus, status);
    
    // Populate user info before sending response
    await order.populate('user', 'name email');
    
    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get order by last 8 characters of ID
// @route   GET /api/orders/last-eight/:lastEight
// @access  Private
export const getOrderByLastEight = async (req, res) => {
  try {
    const lastEight = req.params.lastEight;
    const allOrders = await Order.find({}).populate('user', 'name email');
    
    const order = allOrders.find(o => o._id.toString().slice(-8).toLowerCase() === lastEight.toLowerCase());
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user.id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Get order by last eight error:', error);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get order by short ID (last 6 characters of MongoDB _id)
// @route   GET /api/orders/by-number/:shortId
// @access  Private
export const getOrderByNumber = async (req, res) => {
  try {
    const shortId = req.params.orderNumber;
    console.log('🔍 Searching for short ID:', shortId);
    
    // Find all user's orders
    const orders = await Order.find({ user: req.user.id }).populate('user', 'name email');
    
    // Find order where last 6 characters of _id match
    const order = orders.find(o => o._id.toString().slice(-6).toLowerCase() === shortId.toLowerCase());
    
    if (!order) {
      console.log('❌ No order found with short ID:', shortId);
      return res.status(404).json({ message: 'Order not found' });
    }
    
    console.log('✅ Order found:', order._id);
    res.json(order);
  } catch (error) {
    console.error('Get order by short ID error:', error);
    res.status(500).json({ message: error.message });
  }
};