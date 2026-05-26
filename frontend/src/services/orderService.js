import api from './api';

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

 getOrderByNumber: async (orderNumber) => {
  try {
    const response = await api.get(`/orders/by-number/${orderNumber}`);
    console.log('Service received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Service error:', error);
    throw error;
  }
},

  getMyOrders: async () => {
    const response = await api.get('/orders/myorders');
    return response.data;
  },
};