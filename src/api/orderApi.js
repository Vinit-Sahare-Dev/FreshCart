import { apiRequest } from './apiClient';

export function createOrder(orderPayload) {
  return apiRequest('/api/orders', {
    method: 'POST',
    body: orderPayload,
  });
}

export function getMyOrders() {
  return apiRequest('/api/orders/me');
}

export function getAllOrders() {
  return apiRequest('/api/orders');
}
