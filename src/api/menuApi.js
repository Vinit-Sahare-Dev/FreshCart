import { apiRequest } from './apiClient';

export function getAllDishes() {
  return apiRequest('/api/dishes');
}

export function getDishesByCategory(category) {
  return apiRequest(`/api/dishes?category=${encodeURIComponent(category)}`);
}
