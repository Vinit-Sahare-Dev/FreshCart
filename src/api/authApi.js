import { apiRequest } from './apiClient';

export function login(credentials) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: credentials,
  });
}

export function register(user) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: user,
  });
}

export function getUserProfile(userId) {
  return apiRequest(`/api/users/${userId}`, {
    method: 'GET',
  });
}

export function updateUserProfile(userId, userData) {
  return apiRequest(`/api/users/${userId}`, {
    method: 'PUT',
    body: userData,
  });
}
