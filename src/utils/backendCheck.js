// Utility to check if backend is running
export async function checkBackendConnection() {
  try {
    const response = await fetch('http://localhost:8080/api/dishes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    
    if (response.ok) {
      return { 
        connected: true, 
        message: 'Backend is running and accessible' 
      };
    } else {
      return { 
        connected: false, 
        message: `Backend responded with status: ${response.status}` 
      };
    }
  } catch (error) {
    return { 
      connected: false, 
      message: `Cannot connect to backend: ${error.message}` 
    };
  }
}

