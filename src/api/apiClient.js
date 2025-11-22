const API_BASE_URL = 'http://localhost:8080';

const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('hotel_jwt');
};

export async function apiRequest(path, { method = 'GET', body, headers = {} } = {}) {
  const token = getAuthToken();

  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorData;
    const contentType = response.headers.get('content-type');
    
    try {
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      } else {
        const errorText = await response.text();
        errorData = { message: errorText || `Request failed with status ${response.status}` };
      }
    } catch (e) {
      errorData = { message: `Request failed with status ${response.status}` };
    }
    
    const error = new Error(JSON.stringify(errorData));
    error.response = { data: errorData, status: response.status };
    throw error;
  }

  if (response.status === 204) return null;

  return response.json();
}

export { API_BASE_URL };
