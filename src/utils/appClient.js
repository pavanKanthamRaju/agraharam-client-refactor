import axios from 'axios';

// Create an instance
const apiUrl =process.env.REACT_APP_BASE_URL;
//const apiUrl = process.env.REACT_APP_BACKUP_URL;
console.log("backup url"+ apiUrl)
const apiClient = axios.create({
  // baseURL: 'http://172.20.10.2:5080/api', // base API path


   baseURL: `${apiUrl}/api`,
  // baseURL: 'http://192.168.0.167:5080/api',
//fixed
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Optionally add token if available
    debugger
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error status codes globally
    if (error.response) {
      if (error.response.status === 401) {
        console.warn('Unauthorized, maybe redirect to login.');
        // Optional: logout logic or redirect to login
      } else if (error.response.status >= 500) {
        console.error('Server error. Try again later.');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
