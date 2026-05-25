import api from './api';

export const productService = {
  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
};