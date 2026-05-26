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
  const response = await api.get(`/orders/by-number/${orderNumber}`);
  return response.data;
},

  getMyOrders: async () => {
    const response = await api.get('/orders/myorders');
    return response.data;
  },
};