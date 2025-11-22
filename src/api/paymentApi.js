import { apiRequest } from './apiClient';

export function createPayment(orderId, amount) {
  const params = new URLSearchParams({ orderId: String(orderId), amount: String(amount) });
  return apiRequest(`/api/payments/create?${params.toString()}`, {
    method: 'POST',
  });
}

export function verifyPayment(transactionId, amount) {
  const params = new URLSearchParams({ 
    transactionId: String(transactionId), 
    amount: String(amount) 
  });
  return apiRequest(`/api/payments/verify?${params.toString()}`, {
    method: 'POST',
  });
}