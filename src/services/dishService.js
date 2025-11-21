// src/services/dishService.js
import axiosInstance from '../config/axios.config';

class DishService {
  async getAllDishes() {
    const response = await axiosInstance.get('/dishes');
    return response.data;
  }

  async getDishesByCategory(category) {
    const response = await axiosInstance.get(`/dishes?category=${category}`);
    return response.data;
  }

  async getDishById(id) {
    const response = await axiosInstance.get(`/dishes/${id}`);
    return response.data;
  }

  async createDish(dishData) {
    const response = await axiosInstance.post('/dishes', dishData);
    return response.data;
  }

  async updateDish(id, dishData) {
    const response = await axiosInstance.put(`/dishes/${id}`, dishData);
    return response.data;
  }

  async deleteDish(id) {
    const response = await axiosInstance.delete(`/dishes/${id}`);
    return response.data;
  }
}

export default new DishService();