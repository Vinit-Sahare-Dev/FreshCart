// src/services/orderService.js
import axiosInstance from '../config/axios.config';

class OrderService {
  async createOrder(orderData) {
    const response = await axiosInstance.post('/orders', orderData);
    return response.data;
  }

  async getMyOrders() {
    const response = await axiosInstance.get('/orders/me');
    return response.data;
  }

  async getAllOrders() {
    const response = await axiosInstance.get('/orders');
    return response.data;
  }

  async getOrderById(id) {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
  }

  async updateOrderStatus(id, status) {
    const response = await axiosInstance.put(`/orders/${id}/status`, { status });
    return response.data;
  }
}

export default new OrderService();