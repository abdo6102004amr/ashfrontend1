import apiClient from './api';

export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/api/orders', orderData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return response.data;

  } catch (error) {
    const detail =
      error.normalizedMessage ||
      error.response?.data?.message || // 🔥 عدلت دي
      'Failed to create order';

    if (error.response?.status === 400) {
      if (String(detail).toLowerCase().includes('not available')) {
        throw new Error('One or more products are sold out. Please refresh and try again.');
      }
      throw new Error(detail || 'Invalid order data');
    }

    throw new Error(detail);
  }
};